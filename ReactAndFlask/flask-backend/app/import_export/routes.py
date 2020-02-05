import csv
import io
from http import HTTPStatus
from typing import Any, Dict, List, Optional, Tuple

from app.dal.database import DBWriteException
from app.dal.instance_table import InstanceTable, RackDoesNotExistError
from app.dal.model_table import ModelTable
from app.data_models.instance import Instance
from app.data_models.model import Model
from app.instances.instance_manager import InstanceManager
from app.instances.instance_validator import InstanceValidator
from app.main.types import JSON
from app.models.model_manager import ModelManager
from app.models.model_validator import ModelValidator
from flask import Blueprint, request

import_export = Blueprint("import_export", __name__)


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


def _get_csv():
    # Grab file from request
    f = request.files["file"]
    if not f:
        raise FileNotFoundError

    # Convert to string stream and return csv reader object
    stream: io.StringIO = io.StringIO(f.stream.read().decode("utf-8-sig"), newline=None)
    return csv.reader(stream)


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
            instance: Instance = Instance.from_csv(csv_row=values)
        except KeyError:
            raise InvalidFormatError(message="Columns are missing.")

        validation: str = instance_validator.create_instance_validation(
            instance=instance
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
            raise

    return added, updated, ignored


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
        raise
        return {"message": "Error writing to database."}

    return {
        "message": "success",
        "summary": f"{added} models added, {updated} models updated, and {ignored} models ignored.",
    }


@import_export.route("/instances/import", methods=["POST"])
def import_instances_csv():
    """ Bulk import instances from a csv file """
    try:
        csv_input = _get_csv()
        added, updated, ignored = _parse_instance_csv(csv_input=csv_input)
    except FileNotFoundError:
        return {"message": "No CSV file"}
    except TooFewInputsError as e:
        return {"message": f"Too few inputs in CSV line {e.message}"}
    except (RackDoesNotExistError, ModelDoesNotExistError, InvalidFormatError) as e:
        return {"message": f"{e.message}"}
    except DBWriteException:
        return {"message": "Error writing to database."}

    return {
        "message": "success",
        "summary": f"{added} instances added, {updated} instances updated, and {ignored} instances ignored.",
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

    try:
        filter = data["filter"]
    except:
        return HTTPStatus.BAD_REQUEST

    limit: int = int(data.get("limit", 1000))
    instances_table: InstanceTable = InstanceTable()
    instance_manager: InstanceManager = InstanceManager()

    all_instances: List[Instance] = instance_manager.get_instances(
        filter=filter, limit=limit
    )
    text: str = ",".join(Instance.headers()) + "\n"

    for instance in all_instances:
        model: Model = ModelTable().get_model(identifier=instance.model_id)
        text += (
            instance.to_csv(vendor=model.vendor, model_number=model.model_number) + "\n"
        )

    return {"csvData": text}
