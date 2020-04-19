from typing import Any, Dict, List, Optional

from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.model_table import ModelTable
from app.main.types import JSON

DCTABLE = DatacenterTable()
MODELTABLE = ModelTable()


# def _make_network_connections(model: Model):
#     network_connections: Dict[str, Any] = {}
#     ethernet_ports = model.ethernet_ports
#     if ethernet_ports is None:
#         return network_connections

#     for port in ethernet_ports:
#         network_connections[port] = {
#             Constants.MAC_ADDRESS_KEY: "",
#             Constants.CONNECTION_HOSTNAME: "",
#             Constants.CONNECTION_PORT: "",
#         }

#     return network_connections


# class ModelDoesNotExistError(Exception):
#     """
#     Raised when referenced model does not exist
#     """

#     def __init__(self, vendor: str, model_number: str):
#         self.message: str = f"Model {vendor} {model_number} does not exist."


# class InstanceDoesNotExistError(Exception):
#     def __init__(self, message):
#         self.message = message


# class DatacenterDoesNotExistError(Exception):
#     """
#     Raised when referenced model does not exist
#     """

#     def __init__(self, name: str):
#         self.message: str = f"Datacenter {name} does not exist."


class Instance:
    """
    A data model for an instance

    Attributes:
        model_id (int): id of a model
        hostname (str): host name
        rack_label (str): label of rack of instance
        rack_position (int): vertical position on rack
        owner (Optional[str]): username of owner
        comment (Optional[str]): comment
    """

    def __init__(
        self,
        model_id: int,
        hostname: Optional[str],
        rack_label: str,
        rack_position: int,
        owner: Optional[str],
        comment: Optional[str],
        datacenter_id: int,
        network_connections: Optional[Dict[str, Any]],
        power_connections: Optional[List[str]],
        asset_number: int,
        mount_type: str,
        display_color: Optional[str],
        cpu: Optional[str],
        memory: Optional[int],
        storage: Optional[str],
        chassis_hostname: Optional[str],
        chassis_slot: Optional[int],
    ) -> None:
        self.model_id: int = model_id
        self.hostname: Optional[str] = hostname
        self.rack_label: str = rack_label
        self.rack_position: int = rack_position
        self.owner: Optional[str] = owner
        self.comment: Optional[str] = comment
        self.datacenter_id: int = datacenter_id
        self.network_connections: Optional[Dict[str, Any]] = network_connections
        self.power_connections: Optional[List[str]] = power_connections
        self.asset_number: int = asset_number
        self.mount_type: str = mount_type

        # Model Vals
        self.display_color: Optional[str] = display_color
        self.cpu: Optional[str] = cpu
        self.memory: Optional[int] = memory
        self.storage: Optional[str] = storage

        # Chassis References
        self.chassis_hostname: Optional[str] = chassis_hostname
        self.chassis_slot: Optional[int] = chassis_slot

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Instance):
            return NotImplemented

        return (
            str(self.model_id) == str(other.model_id)
            and self.hostname == other.hostname
            and self.rack_label == other.rack_label
            and str(self.rack_position) == str(other.rack_position)
            and self.owner == other.owner
            and self.comment == other.comment
            and int(self.asset_number) == int(other.asset_number)
            and self.network_connections == other.network_connections
        )

    @classmethod
    def headers(cls) -> List[str]:
        return [
            Constants.ASSET_NUMBER_KEY,
            Constants.HOSTNAME_KEY,
            Constants.CSV_DC_NAME_KEY,
            Constants.CSV_OFFLINE_SITE_KEY,
            Constants.RACK_KEY,
            Constants.RACK_POSITION_KEY,
            Constants.CSV_CHASSIS_NUMBER,
            Constants.CSV_CHASSIS_SLOT,
            Constants.VENDOR_KEY,
            Constants.MODEL_NUMBER_KEY,
            Constants.OWNER_KEY,
            Constants.COMMENT_KEY,
            Constants.CSV_POWER_PORT_1,
            Constants.CSV_POWER_PORT_2,
            Constants.CSV_CUSTOM_DISPLAY_COLOR,
            Constants.CSV_CUSTOM_CPU,
            Constants.CSV_CUSTOM_MEMORY,
            Constants.CSV_CUSTOM_STORAGE,
        ]

    def make_json(self) -> JSON:
        return {
            Constants.MODEL_KEY: self.model_id,
            Constants.HOSTNAME_KEY: self.hostname,
            Constants.RACK_KEY: f"{self.rack_label}",
            Constants.RACK_POSITION_KEY: self.rack_position,
            Constants.OWNER_KEY: self.owner,
            Constants.COMMENT_KEY: self.comment,
            Constants.DC_ID_KEY: self.datacenter_id,
            Constants.NETWORK_CONNECTIONS_KEY: self.network_connections,
            Constants.POWER_CONNECTIONS_KEY: self.power_connections,
            Constants.ASSET_NUMBER_KEY: self.asset_number,
            Constants.MOUNT_TYPE_KEY: self.mount_type,
            Constants.DISPLAY_COLOR_KEY: self.display_color,
            Constants.CPU_KEY: self.cpu,
            Constants.MEMORY_KEY: self.memory,
            Constants.STORAGE_KEY: self.storage,
            Constants.CHASSIS_HOSTNAME_KEY: self.chassis_hostname,
            Constants.CHASSIS_SLOT_KEY: self.chassis_slot,
        }

    def make_json_with_model_and_datacenter(self, model, datacenter):
        return {
            Constants.MODEL_KEY: f"{model.vendor} {model.model_number}",
            Constants.HEIGHT_KEY: f"{model.height}",
            Constants.HOSTNAME_KEY: self.hostname,
            Constants.RACK_KEY: f"{self.rack_label}",
            Constants.RACK_POSITION_KEY: self.rack_position,
            Constants.OWNER_KEY: self.owner,
            Constants.COMMENT_KEY: self.comment,
            Constants.DC_NAME_KEY: datacenter.name,
            Constants.DC_ABRV_KEY: datacenter.abbreviation,
            Constants.NETWORK_CONNECTIONS_KEY: self.network_connections,
            Constants.POWER_CONNECTIONS_KEY: self.power_connections,
            Constants.ASSET_NUMBER_KEY: self.asset_number,
            Constants.MOUNT_TYPE_KEY: self.mount_type,
            Constants.DISPLAY_COLOR_KEY: self.display_color,
            Constants.ORIG_DISPLAY_COLOR_KEY: model.display_color,
            Constants.CPU_KEY: self.cpu,
            Constants.ORIG_CPU_KEY: model.cpu,
            Constants.MEMORY_KEY: self.memory,
            Constants.ORIG_MEMORY_KEY: model.memory,
            Constants.STORAGE_KEY: self.storage,
            Constants.ORIG_STORAGE_KEY: model.storage,
            Constants.CHASSIS_HOSTNAME_KEY: self.chassis_hostname,
            Constants.CHASSIS_SLOT_KEY: self.chassis_slot,
        }

    # @classmethod
    # def from_csv(cls, csv_row: Dict[str, Any]) -> "Instance":
    #     for key in csv_row.keys():
    #         if csv_row[key] == "None":
    #             csv_row[key] = ""

    #     power_connections = [
    #         csv_row[Constants.CSV_POWER_PORT_1],
    #         csv_row[Constants.CSV_POWER_PORT_2],
    #     ]
    #     datacenter_id = DCTABLE.get_datacenter_id_by_name(
    #         csv_row[Constants.CSV_DC_NAME_KEY]
    #     )
    #     if datacenter_id is None:
    #         raise DatacenterDoesNotExistError()
    #     model_id = MODELTABLE.get_model_id_by_vendor_number(
    #         csv_row[Constants.VENDOR_KEY], csv_row[Constants.MODEL_NUMBER_KEY]
    #     )
    #     model: Model = MODELTABLE.get_model(model_id)
    #     network_connections = _make_network_connections(model)

    #     # if csv_row[Constants.ASSET_NUMBER_KEY] == "":

    #     return Instance(
    #         model_id=model_id,
    #         hostname=csv_row[Constants.HOSTNAME_KEY],
    #         rack_label=csv_row[Constants.RACK_KEY],
    #         rack_position=csv_row[Constants.RACK_POSITION_KEY],
    #         owner=csv_row[Constants.OWNER_KEY],
    #         comment=csv_row[Constants.COMMENT_KEY],
    #         datacenter_id=datacenter_id,
    #         network_connections=network_connections,
    #         power_connections=power_connections,
    #         asset_number=csv_row[Constants.ASSET_NUMBER_KEY],
    #     )

    def _format_csv_entry(self, entry: str) -> str:
        if '"' not in entry and "\n" not in entry:
            return entry

        new_entry: str = ""
        for character in entry:
            if character == '"':
                new_entry += '""'
            else:
                new_entry += character

        return f'"{new_entry}"'

    def to_csv(self, vendor: str, model_number: str, chassis_number="") -> str:
        """ Get the model as a csv row """
        json_data: JSON = self.make_json()
        json_data[Constants.VENDOR_KEY] = vendor
        json_data[Constants.MODEL_NUMBER_KEY] = model_number
        json_data[Constants.CSV_CHASSIS_NUMBER] = chassis_number
        json_data[Constants.CSV_CUSTOM_DISPLAY_COLOR] = json_data[
            Constants.DISPLAY_COLOR_KEY
        ]
        json_data[Constants.CSV_CUSTOM_STORAGE] = json_data[Constants.STORAGE_KEY]
        json_data[Constants.CSV_CUSTOM_MEMORY] = json_data[Constants.MEMORY_KEY]
        json_data[Constants.CSV_CUSTOM_CPU] = json_data[Constants.CPU_KEY]
        site = DCTABLE.get_datacenter(self.datacenter_id)

        # Adjust for extra offline storage col
        if site.is_offline_storage:
            json_data[Constants.CSV_OFFLINE_SITE_KEY] = site.abbreviation
            json_data[Constants.CSV_DC_NAME_KEY] = ""
        else:
            json_data[Constants.CSV_OFFLINE_SITE_KEY] = ""
            json_data[Constants.CSV_DC_NAME_KEY] = site.abbreviation

        # Adjust for extra chassis_number, chassis_slot cols
        if self.mount_type == Constants.BLADE_KEY:
            json_data[Constants.CSV_CHASSIS_NUMBER] = chassis_number

        print(json_data)

        if self.power_connections is None:
            json_data[Constants.CSV_POWER_PORT_1] = ""
            json_data[Constants.CSV_POWER_PORT_2] = ""
        else:
            if len(self.power_connections) >= 2:
                json_data[Constants.CSV_POWER_PORT_1] = self.power_connections[0]
                json_data[Constants.CSV_POWER_PORT_2] = self.power_connections[1]
            elif len(self.power_connections) == 1:
                json_data[Constants.CSV_POWER_PORT_1] = self.power_connections[0]
                json_data[Constants.CSV_POWER_PORT_2] = ""
            else:
                json_data[Constants.CSV_POWER_PORT_1] = ""
                json_data[Constants.CSV_POWER_PORT_2] = ""

        values: List[str] = list(
            map(
                lambda x: self._format_csv_entry(entry=str(json_data[x])),
                Instance.headers(),
            )
        )
        clean_values: List[str] = list(map(lambda x: "" if x == "None" else x, values))
        for i in range(0, len(clean_values)):
            if clean_values[i] == "-1":
                clean_values[i] = ""

        return ",".join(clean_values)

    def __repr__(self) -> str:
        return f"Instance {self.hostname} {self.rack_label}"
