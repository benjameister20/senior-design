import csv
import io
from http import HTTPStatus
from typing import Any, Dict, List, Optional

from app.dal.database import DBWriteException
from app.dal.instance_table import InstanceTable, RackDoesNotExistError
from app.dal.model_table import ModelTable
from app.data_models.instance import Instance
from app.data_models.model import Model
from app.instances.instance_manager import InstanceManager
from app.main.types import JSON
from app.models.model_manager import ModelManager
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
        self.message: str = f"Model {vendor} {model_number}"


def _get_csv():
    # Grab file from request
    f = request.files["file"]
    if not f:
        raise FileNotFoundError

    # Convert to string stream and return csv reader object
    stream: io.StringIO = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    return csv.reader(stream)


def _parse_model_csv(csv_input) -> None:
    model_table: ModelTable = ModelTable()

    # Extract header row
    try:
        headers: List[str] = next(csv_input)
    except StopIteration:
        raise InvalidFormatError(message="No header row.")

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

        # Write to database
        try:
            model_table.add_or_update(model=model)
        except DBWriteException:
            raise


def _parse_instance_csv(csv_input) -> None:
    instance_table: InstanceTable = InstanceTable()
    model_table: ModelTable = ModelTable()

    # Extract header row
    try:
        headers: List[str] = next(csv_input)
    except StopIteration:
        raise InvalidFormatError(message="No header row.")

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

        # If model does not exist, create it
        if model_id is None:
            raise ModelDoesNotExistError(vendor=vendor, model_number=model_number)

        values["model_id"] = model_id

        # Create the instance; Raise an exception if some columns are missing
        try:
            instance: Instance = Instance.from_csv(csv_row=values)
        except KeyError:
            raise InvalidFormatError(message="Columns are missing.")

        # Write to database
        try:
            instance_table.add_or_update(instance=instance)
        except RackDoesNotExistError:
            raise
        except DBWriteException:
            raise


@import_export.route("/models/import", methods=["POST"])
def import_models_csv():
    """ Bulk import models from a csv file """
    try:
        csv_input = _get_csv()
        _parse_model_csv(csv_input=csv_input)
    except FileNotFoundError:
        return {"message": "No CSV file"}, HTTPStatus.NOT_FOUND
    except InvalidFormatError as e:
        return {"message": f"{e.message}"}, HTTPStatus.BAD_REQUEST
    except TooFewInputsError as e:
        return (
            {"message": f"Too few inputs in CSV line {e.message}"},
            HTTPStatus.BAD_REQUEST,
        )
    except DBWriteException:
        raise
        return (
            {"message": "Error writing to database."},
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    return {"message": "Success"}, HTTPStatus.OK


@import_export.route("/instances/import", methods=["POST"])
def import_instances_csv():
    """ Bulk import instances from a csv file """
    try:
        csv_input = _get_csv()
        _parse_instance_csv(csv_input=csv_input)
    except FileNotFoundError:
        return {"message": "No CSV file"}, HTTPStatus.NOT_FOUND
    except TooFewInputsError as e:
        return (
            {"message": f"Too few inputs in CSV line {e.message}"},
            HTTPStatus.BAD_REQUEST,
        )
    except (RackDoesNotExistError, ModelDoesNotExistError) as e:
        return {"message": f"{e.message}"}, HTTPStatus.BAD_REQUEST
    except DBWriteException:
        return (
            {"message": "Error writing to database."},
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    return {"message": "Success"}, HTTPStatus.OK


@import_export.route("/models/export")
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

    return {"data": text}


@import_export.route("/instances/export")
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
        text += instance.to_csv() + "\n"

    return text
