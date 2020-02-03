from typing import List

from app.dal.database import DBWriteException
from app.dal.rack_table import RackTable
from app.data_models.rack import Rack
from app.main.types import JSON
from app.racks.rack_manager import (
    InvalidRangeError,
    RackNotEmptyError,
    add_rack_range,
    delete_rack_range,
    get_rack_range,
)
from flask import Blueprint, request

racks = Blueprint(
    "racks",
    __name__,
    url_prefix="/racks",
    template_folder="templates",
    static_folder="static",
)


@racks.route("/all", methods=["GET"])
def get_all_racks():
    """ Get all racks """

    returnJSON = createJSON()

    try:
        rack_table: RackTable = RackTable()
        rack_list: List[Rack] = rack_table.get_all_racks()

        returnJSON = addRacksTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(map(lambda x: x.make_json(), rack_list)),
        )
        return returnJSON
    except:
        return (addMessageToJSON(returnJSON, "Unable to retrieve rack data."),)


@racks.route("/create", methods=["POST"])
def create_racks():
    """ Create a range of racks """
    returnJSON = createJSON()
    data: JSON = request.get_json()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        add_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )
        return addMessageToJSON(returnJSON, "success")
    except KeyError:
        return addMessageToJSON(returnJSON, "Unable to create racks.")
    except DBWriteException:
        return addMessageToJSON(returnJSON, "Unable to create and save racks.")
    except InvalidRangeError:
        return addMessageToJSON(
            returnJSON,
            "Invalid range of racks to add. Please make sure you provide a valid rack range.",
        )


@racks.route("/details", methods=["POST"])
def get_rack_details():
    """ Get details of a range of racks """
    data: JSON = request.get_json()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        racks = get_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )

        returnJSON = {}
        returnJSON["racks"] = racks

        return addMessageToJSON(returnJSON, "success")
    except KeyError:
        return addMessageToJSON(returnJSON, "Unable to retrieve rack data.")
    except InvalidRangeError:
        return addMessageToJSON(
            returnJSON,
            "Invalid range of racks to add. Please make sure you provide a valid rack range.",
        )


@racks.route("/delete", methods=["POST"])
def delete_racks():
    """ Delete a range of racks """
    data: JSON = request.get_json()
    returnJSON = createJSON()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        delete_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )
        return addMessageToJSON(returnJSON, "success")
    except (KeyError, DBWriteException):
        return addMessageToJSON(returnJSON, "Unable to delete rack.")
    except InvalidRangeError:
        return addMessageToJSON(
            returnJSON,
            "Invalid range of racks to add. Please make sure you provide a valid rack range.",
        )
    except RackNotEmptyError:
        return addMessageToJSON(
            returnJSON,
            "Cannot delete racks that are not empty. Delete all instances on the rack then delete the rack.",
        )


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addRacksTOJSON(json, rackArr: List[str]) -> dict:
    json["racks"] = rackArr
    return json
