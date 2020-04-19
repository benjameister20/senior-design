import csv
import io
import json
from http import HTTPStatus
from typing import Any, Dict, List, Optional, Tuple

from app.constants import Constants
from app.dal.database import DBWriteException
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable, RackDoesNotExistError
from app.dal.model_table import ModelTable
from app.data_models.instance import Instance
from app.data_models.model import Model
from app.instances.asset_num_generator import AssetNumGenerator
from app.instances.instance_manager import InstanceManager
from app.instances.instance_validator import InstanceValidator
from app.main.types import JSON
from app.models.model_manager import ModelManager
from app.models.model_validator import ModelValidator
from flask import Blueprint, request

import_export = Blueprint("import_export", __name__)

ASSETNUMGEN = AssetNumGenerator()
DCTABLE = DatacenterTable()
MODELTABLE = ModelTable()
# INSTANCETABLE = InstanceTable()


class FileNotFoundError(Exception):
    """
    Raised when a csv file is not included
    """


class TooFewInputsError(Exception):
    """
    Raised when too few inputs are provided in the csv
    """

    def __init__(self, message: str):
        self.message: str = message


class InvalidFormatError(Exception):
    """
    Raised when csv file has invalid format
    """

    def __init__(self, message: str):
        self.message: str = message


class ModelDoesNotExistError(Exception):
    """
    Raised when referenced model does not exist
    """

    def __init__(self, vendor: str, model_number: str):
        self.message: str = f"Model {vendor} {model_number} does not exist."


class InstanceDoesNotExistError(Exception):
    def __init__(self, message):
        self.message = message


class DatacenterDoesNotExistError(Exception):
    """
    Raised when referenced model does not exist
    """

    def __init__(self, name: str):
        self.message: str = f"Site {name} does not exist."


def _get_csv():
    # Grab file from request
    f = request.files["file"]
    if not f:
        raise FileNotFoundError

    # Convert to string stream and return csv reader object
    stream: io.StringIO = io.StringIO(f.stream.read().decode("utf-8-sig"), newline=None)
    return csv.reader(stream)


def _make_network_connections(model: Model):
    network_connections: Dict[str, Any] = {}
    ethernet_ports = model.ethernet_ports
    if ethernet_ports is None:
        return network_connections

    for port in ethernet_ports:
        network_connections[port] = {
            Constants.MAC_ADDRESS_KEY: "",
            Constants.CONNECTION_HOSTNAME: "",
            Constants.CONNECTION_PORT: "",
        }

    return network_connections


def _make_instance_from_csv(csv_row: Dict[str, Any]) -> Instance:
    # print(csv_row)
    for key in csv_row.keys():
        if csv_row[key] == "None":
            csv_row[key] = ""

    # Parse Power Connections
    power_connections = []
    if csv_row[Constants.CSV_POWER_PORT_1] != "":
        power_connections.append(csv_row[Constants.CSV_POWER_PORT_1])

    if csv_row[Constants.CSV_POWER_PORT_2] != "":
        power_connections.append(csv_row[Constants.CSV_POWER_PORT_2])

    # Parse Mount Type + Location (Datacenter, Offline site, or Chassis)
    rack_label = ""
    rack_position = -1
    datacenter_id = -1
    print(f"DATACENTER = {csv_row[Constants.CSV_DC_NAME_KEY]}")
    print(csv_row)
    if csv_row[Constants.CSV_DC_NAME_KEY] != "":
        datacenter_id = DCTABLE.get_datacenter_id_by_abbreviation(
            csv_row[Constants.CSV_DC_NAME_KEY]
        )
        if datacenter_id is None:
            print("didn't find it")
            raise DatacenterDoesNotExistError(csv_row[Constants.CSV_DC_NAME_KEY])
        rack_label = csv_row[Constants.RACK_KEY]
        rack_position = csv_row[Constants.RACK_POSITION_KEY]
    elif csv_row[Constants.CSV_OFFLINE_SITE_KEY] != "":
        datacenter_id = DCTABLE.get_datacenter_id_by_abbreviation(
            csv_row[Constants.CSV_OFFLINE_SITE_KEY]
        )
        if datacenter_id is None:
            raise DatacenterDoesNotExistError(csv_row[Constants.CSV_DC_NAME_KEY])

    chassis_hostname = ""
    chassis_slot = -1
    # if not (csv_row[Constants.CSV_CHASSIS_NUMBER] == ""):  # Indicates asset is a blade
    #     chassis_number = csv_row[Constants.CSV_CHASSIS_NUMBER]
    #     print(f"CHASSIS NUMBER: {chassis_number}")
    #     chassis = InstanceTable().get_instance_by_asset_number(chassis_number)
    #     if chassis is not None:
    #         chassis_hostname = chassis.hostname
    #         chassis_slot = csv_row[Constants.CSV_CHASSIS_SLOT]

    # Parse model information
    model_id = MODELTABLE.get_model_id_by_vendor_number(
        csv_row[Constants.VENDOR_KEY], csv_row[Constants.MODEL_NUMBER_KEY]
    )
    if model_id is None:
        raise ModelDoesNotExistError(
            csv_row[Constants.VENDOR_KEY], csv_row[Constants.MODEL_NUMBER_KEY]
        )

    model = MODELTABLE.get_model(model_id)
    if model is None:
        raise ModelDoesNotExistError(
            csv_row[Constants.VENDOR_KEY], csv_row[Constants.MODEL_NUMBER_KEY]
        )
    mount_type = model.mount_type
    network_connections = _make_network_connections(model)

    return Instance(
        model_id=model_id,
        hostname=csv_row[Constants.HOSTNAME_KEY],
        rack_label=rack_label,
        rack_position=rack_position,
        owner=csv_row[Constants.OWNER_KEY],
        comment=csv_row[Constants.COMMENT_KEY],
        datacenter_id=datacenter_id,
        network_connections=network_connections,
        power_connections=power_connections,
        asset_number=csv_row[Constants.ASSET_NUMBER_KEY]
        if csv_row[Constants.ASSET_NUMBER_KEY] != ""
        else ASSETNUMGEN.get_next_asset_number(),
        mount_type=mount_type,
        display_color=csv_row[Constants.CSV_CUSTOM_DISPLAY_COLOR],
        cpu=csv_row[Constants.CSV_CUSTOM_CPU],
        memory=csv_row[Constants.CSV_CUSTOM_MEMORY],
        storage=csv_row[Constants.CSV_CUSTOM_STORAGE],
        chassis_hostname=chassis_hostname,
        chassis_slot=chassis_slot,
    )


def _parse_model_csv(csv_input) -> Tuple[int, int, int]:
    model_table: ModelTable = ModelTable()
    model_validator: ModelValidator = ModelValidator()

    # Extract header row
    try:
        headers: List[str] = next(csv_input)
    except StopIteration:
        raise InvalidFormatError(message="No header row.")

    models: List[Model] = []
    for row in csv_input:
        # Ensure proper input length of csv row
        if len(row) != len(headers):
            raise TooFewInputsError(message=",".join(row))

        # Generate dictionary that maps column header to value
        values: Dict[str, str] = {}
        for index, item in enumerate(row):
            values[headers[index]] = item

        # Create the model; Raise an exception if some columns are missing
        try:
            model: Model = Model.from_csv(csv_row=values)
        except KeyError:
            raise InvalidFormatError(message="Columns are missing.")

        if model.mount_type == Constants.BLADE_KEY:
            model.height = 1

        validation: str = model_validator.create_model_validation(model=model)
        if (
            validation != "success"
            and validation != "This vendor and model number combination already exists."
        ):
            raise InvalidFormatError(message=validation)

        # Append to list to write to database
        models.append(model)

    added, updated, ignored = 0, 0, 0
    for model in models:
        # Write to database
        try:
            add, update, ignore = model_table.add_or_update(model=model)
            added += add
            updated += update
            ignored += ignore
        except DBWriteException:
            raise

    return added, updated, ignored


def _parse_instance_csv(csv_input) -> Tuple[int, int, int]:
    instance_table: InstanceTable = InstanceTable()
    model_table: ModelTable = ModelTable()
    instance_validator: InstanceValidator = InstanceValidator()

    # Extract header row
    try:
        headers: List[str] = next(csv_input)
    except StopIteration:
        raise InvalidFormatError(message="No header row.")

    instances: List[Instance] = []
    for row in csv_input:
        # Ensure proper input length of csv row
        if len(row) != len(headers):
            raise TooFewInputsError(message=",".join(row))

        # Generate dictionary that maps column header to value
        values: Dict[str, Any] = {}
        for index, item in enumerate(row):
            values[headers[index]] = item

        vendor: str = values["vendor"]
        model_number: str = values["model_number"]
        model_id: Optional[int] = model_table.get_model_id_by_vendor_number(
            vendor=vendor, model_number=model_number
        )

        # If model does not exist, throw error
        if model_id is None:
            raise ModelDoesNotExistError(vendor=vendor, model_number=model_number)

        values["model_id"] = model_id

        # Create the instance; Raise an exception if some columns are missing
        try:
            # instance: Instance = Instance.from_csv(csv_row=values)
            instance: Instance = _make_instance_from_csv(csv_row=values)
        except KeyError as e:
            print(str(e))
            raise InvalidFormatError(message="Columns are missing.")

        # print("")
        # print(instance)
        # print("ADJUSTING FOR CHASSIS")
        # print("")
        #  Set chassis hostname and slot within an instance if it is a blade
        if values[Constants.CSV_CHASSIS_NUMBER] != "":  # Indicates asset is a blade
            chassis_number = values[Constants.CSV_CHASSIS_NUMBER]
            # print(f"CHASSIS NUMBER: {chassis_number}")
            chassis = InstanceTable().get_instance_by_asset_number(chassis_number)
            if chassis is not None:  # Chassis already existed
                instance.chassis_hostname = chassis.hostname
                instance.chassis_slot = int(values[Constants.CSV_CHASSIS_SLOT])
                instance.datacenter_id = chassis.datacenter_id
            else:  # Chassis is either being created in this import or doesn't exist
                found = False
                for inst in instances:
                    # print(inst)
                    if inst.asset_number == chassis_number:
                        instance.chassis_hostname = inst.hostname
                        instance.chassis_slot = int(values[Constants.CSV_CHASSIS_SLOT])
                        instance.datacenter_id = inst.datacenter_id
                        found = True
                if not found:
                    raise InstanceDoesNotExistError(
                        f"Chassis {chassis_number} does not exist"
                    )

        # validation: str = instance_validator.edit_instance_validation(
        #     instance=instance,
        #     original_asset_number=instance.asset_number
        # )
        # print(validation)
        # dc_id = DCTABLE.get_datacenter_id_by_abbreviation(
        #     values[Constants.CSV_DC_NAME_KEY]
        # )
        # if dc_id is None:
        #     raise DatacenterDoesNotExistError(values[Constants.CSV_DC_NAME_KEY])

        existing_instance = instance_table.get_instance_by_asset_number(
            instance.asset_number
        )

        if existing_instance is None:
            validation: str = instance_validator.create_instance_validation(
                instance=instance, queue=instances
            )
            if (
                validation != "success"
                and validation
                != f"An instance with hostname {instance.hostname} exists at location {instance.rack_label} U{instance.rack_position}"
            ):
                raise InvalidFormatError(message=validation)

        instances.append(instance)

    added, updated, ignored = 0, 0, 0
    for instance in instances:
        # Write to database
        try:
            add, update, ignore = instance_table.add_or_update(instance=instance)
            added += add
            updated += update
            ignored += ignore
        except (RackDoesNotExistError, DBWriteException):
            print("I BROKE HERE")
            raise

    return added, updated, ignored


def _parse_connection_csv(csv_input) -> Tuple[int, int, int]:
    instance_table: InstanceTable = InstanceTable()
    model_table: ModelTable = ModelTable()
    instance_validator: InstanceValidator = InstanceValidator()

    # Extract header row ----
    try:
        headers: List[str] = next(csv_input)
    except StopIteration:
        raise InvalidFormatError(message="No header row.")

    snapshots: Dict[int, Dict[str, str]] = {}
    instances: List[Instance] = []
    for row in csv_input:
        # Ensure proper input length of csv row
        if len(row) != len(headers):
            raise TooFewInputsError(message=",".join(row))

        # Generate dictionary that maps column header to value
        values: Dict[str, Any] = {}
        for index, item in enumerate(row):
            values[headers[index]] = item

        src_mac_addr: str = values[Constants.CSV_SRC_MAC]
        src_hostname: str = values[Constants.CSV_SRC_HOST]
        dst_hostname: str = values[Constants.CSV_DEST_HOST]
        # values[Constants.CSV_SRC_PORT]
        # values[Constants.CSV_DEST_PORT]

        src_instance = instance_table.get_instance_by_hostname(src_hostname)
        dst_instance = instance_table.get_instance_by_hostname(dst_hostname)
        src_net_conn = src_instance.network_connections
        dst_net_conn = dst_instance.network_connections

        if src_instance.asset_number in snapshots.keys():
            src_net_conn = snapshots[src_instance.asset_number]
        if dst_instance.asset_number in snapshots.keys():
            dst_net_conn = snapshots[dst_instance.asset_number]

        # If model does not exist, throw error
        if src_instance is None:
            raise InstanceDoesNotExistError(
                f"Source instance with hostname {src_hostname} does not exist"
            )

        if dst_instance is None:
            raise InstanceDoesNotExistError(
                f"Destination instance with hostname {dst_hostname} does not exist"
            )

        # # replace mac if existing is blank
        # conn_exists = False
        # if connection in connections:
        #     print(f"EXISTS: {connection}")
        #     conn_exists = True
        #     if src_instance.network_connections[values[Constants.CSV_SRC_PORT]][Constants.MAC_ADDRESS_KEY] == "":
        #         src_instance.network_connections[
        #             values[Constants.CSV_SRC_PORT]
        #         ][Constants.MAC_ADDRESS_KEY] = src_mac_addr
        #
        # else:
        # print("SRC CHANGES")
        # print(src_instance.network_connections)
        src_net_conn[values[Constants.CSV_SRC_PORT]][
            Constants.MAC_ADDRESS_KEY
        ] = values[Constants.CSV_SRC_MAC]
        src_net_conn[values[Constants.CSV_SRC_PORT]][
            Constants.CONNECTION_HOSTNAME
        ] = values[Constants.CSV_DEST_HOST]
        src_net_conn[values[Constants.CSV_SRC_PORT]][
            Constants.CONNECTION_PORT
        ] = values[Constants.CSV_DEST_PORT]
        # print(src_instance.network_connections)
        # print("DST CHANGES")
        # print(dst_instance.network_connections)
        dst_net_conn[values[Constants.CSV_DEST_PORT]][
            Constants.CONNECTION_HOSTNAME
        ] = values[Constants.CSV_SRC_HOST]
        dst_net_conn[values[Constants.CSV_DEST_PORT]][
            Constants.CONNECTION_PORT
        ] = values[Constants.CSV_SRC_PORT]
        # print(dst_instance.network_connections)
        # print("DONE")

        snapshots[src_instance.asset_number] = src_net_conn
        snapshots[dst_instance.asset_number] = dst_net_conn

        src_instance.network_connections = src_net_conn
        dst_instance.network_connections = dst_net_conn

        # src_instance_json = src_instance.make_json()
        # dst_instance_json = dst_instance.make_json()

        # src_instance_json[Constants.ASSET_NUMBER_ORIG_KEY] = src_instance.asset_number
        # dst_instance_json[Constants.ASSET_NUMBER_ORIG_KEY] = dst_instance.asset_number

        # Create the connection; Raise an exception if some columns are missing
        # try:
        #     # instance: Instance = Instance.from_csv(csv_row=values)
        #     instance_manager.edit_instance(src_instance_json)
        #     instance_manager.edit_instance(dst_instance_json)
        # except Exception as e:
        #     print(str(e))
        #     raise InvalidFormatError(message="Columns are missing.")

        validation: str = instance_validator.validate_connections(
            src_instance.network_connections, src_instance.hostname
        )

        if validation != "success":
            raise InvalidFormatError(message=validation)

        instances.append(src_instance)
        instances.append(dst_instance)

    # print("INSTANCEs")
    # print(instances)
    # for inst in instances:
    #     print(inst.network_connections)

    added, updated, ignored = 0, 0, 0
    for instance in instances:
        # Write to database
        try:
            add, update, ignore = instance_table.add_or_update(instance=instance)
            added += add
            updated += update
            ignored += ignore
        except (RackDoesNotExistError, DBWriteException):
            print("I BROKE HERE")
            raise

    return added, updated // 2, ignored // 2


@import_export.route("/models/import", methods=["POST"])
def import_models_csv():
    """ Bulk import models from a csv file """
    try:
        csv_input = _get_csv()
        added, updated, ignored = _parse_model_csv(csv_input=csv_input)
    except FileNotFoundError:
        return {"message": "No CSV file"}
    except InvalidFormatError as e:
        return {"message": f"{e.message}"}
    except TooFewInputsError as e:
        return {"message": f"Too few inputs in CSV line {e.message}"}
    except DBWriteException:
        return {"message": "Error writing to database."}

    return {
        "message": "success",
        "summary": f"{added} models added, {updated} models updated, and {ignored} models ignored.",
    }


@import_export.route("/instances/import", methods=["POST"])
def import_instances_csv():
    """ Bulk import instances from a csv file """
    print(json.dumps(request.json, indent=4))
    print("IMPORTING INSTANCES")

    try:
        csv_input = _get_csv()
        added, updated, ignored = _parse_instance_csv(csv_input=csv_input)
    except FileNotFoundError:
        return {"message": "No CSV file"}
    except TooFewInputsError as e:
        return {"message": f"Too few inputs in CSV line {e.message}"}
    except (RackDoesNotExistError, ModelDoesNotExistError, InvalidFormatError) as e:
        return {"message": f"{e.message}"}
    # except DBWriteException:
    #     return {"message": "Error writing to database."}
    except DatacenterDoesNotExistError as e:
        return {"message": f"The datacenter {e.message} does not exist"}
    except InstanceDoesNotExistError as e:
        return {"message": e.message}

    return {
        "message": "success",
        "summary": f"{added} instances added, {updated} instances updated, and {ignored} instances ignored.",
    }


@import_export.route("/networkConnections/import", methods=["POST"])
def import_network_connections_csv():
    try:
        csv_input = _get_csv()
        added, updated, ignored = _parse_connection_csv(csv_input=csv_input)
    except:
        return {"message": "Error occured."}

    return {
        "message": "success",
        "summary": f"{added} connections added, {updated} connections updated, and {ignored} connections ignored.",
    }


@import_export.route("/models/export", methods=["POST"])
def export_models():
    """ Export models with given filters """
    data: JSON = request.get_json()

    try:
        filter = data["filter"]
    except:
        return HTTPStatus.BAD_REQUEST

    limit: int = int(data.get("limit", 1000))
    model_table: ModelTable = ModelTable()
    model_manager: ModelManager = ModelManager()

    all_models: List[Model] = model_manager.get_models(filter=filter, limit=limit)
    text: str = ",".join(Model.headers()) + "\n"

    for model in all_models:
        text += model.to_csv() + "\n"

    return {"csvData": text}


@import_export.route("/instances/export", methods=["POST"])
def export_instances():
    """ Export instances with given filters """
    data: JSON = request.get_json()

    print(json.dumps(data, indent=4))
    try:
        filter = data["filter"]
        dc_name = data["datacenter_name"]
    except:
        return HTTPStatus.BAD_REQUEST

    limit: int = int(data.get("limit", 1000))
    instances_table: InstanceTable = InstanceTable()
    instance_manager: InstanceManager = InstanceManager()

    all_instances: List[Instance] = instance_manager.get_instances(
        filter=filter, dc_name=dc_name, limit=limit
    )
    text: str = ",".join(Instance.headers()) + "\n"

    for instance in all_instances:
        model: Model = ModelTable().get_model(identifier=instance.model_id)
        chassis_number = ""
        if instance.mount_type == Constants.BLADE_KEY:
            chassis_host = instance.chassis_hostname
            chassis = InstanceTable().get_instance_by_hostname(chassis_host)
            chassis_number = chassis.asset_number

        text += (
            instance.to_csv(
                vendor=model.vendor,
                model_number=model.model_number,
                chassis_number=chassis_number,
            )
            + "\n"
        )

    return {"csvData": text}


@import_export.route("/instances/exportConnections", methods=["POST"])
def export_connections():
    """ Export instances with given filters """
    data: JSON = request.get_json()

    print(json.dumps(data, indent=4))
    try:
        filter = data["filter"]
        dc_name = data["datacenter_name"]
    except:
        return HTTPStatus.BAD_REQUEST

    limit: int = int(data.get("limit", 1000))
    instances_table: InstanceTable = InstanceTable()
    instance_manager: InstanceManager = InstanceManager()

    all_instances: List[Instance] = instance_manager.get_instances(
        filter=filter, dc_name=dc_name, limit=limit
    )
    text: str = ",".join(
        [
            Constants.CSV_SRC_HOST,
            Constants.CSV_SRC_PORT,
            Constants.CSV_SRC_MAC,
            Constants.CSV_DEST_HOST,
            Constants.CSV_DEST_PORT,
        ]
    ) + "\n"

    for instance in all_instances:
        src_hostname = instance.hostname
        network_connections = instance.network_connections
        for port in network_connections.keys():
            connection = []
            connection.append(src_hostname)
            connection.append(port)
            connection.append(network_connections[port][Constants.MAC_ADDRESS_KEY])
            connection.append(network_connections[port][Constants.CONNECTION_HOSTNAME])
            connection.append(network_connections[port][Constants.CONNECTION_PORT])
            if not (
                network_connections[port][Constants.CONNECTION_HOSTNAME] == ""
                and network_connections[port][Constants.CONNECTION_PORT] == ""
            ):
                text += ",".join(connection)
                text += "\n"
            print(connection)

    return {"csvData": text}
