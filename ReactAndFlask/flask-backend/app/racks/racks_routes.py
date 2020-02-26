from typing import List

from app.constants import Constants
from app.dal.database import DBWriteException
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import RackDoesNotExistError
from app.dal.rack_table import RackTable
from app.data_models.rack import Rack
from app.decorators.auth import requires_auth, requires_role
from app.decorators.logs import log
from app.logging.logger import Logger
from app.main.types import JSON
from app.racks.diagram_manager import DiagramManager
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
LOGGER = Logger()


@racks.route("/all", methods=["POST"])
@requires_auth(request)
def get_all_racks():
    """ Get all racks """

    returnJSON = createJSON()
    data: JSON = request.get_json()

    try:
        datacenter_name: str = data[Constants.DC_NAME_KEY]
        datacenter_id = get_datacenter_id_by_name(datacenter_name)

        rack_table: RackTable = RackTable()
        rack_list: List[Rack] = rack_table.get_rack_by_datacenter(datacenter_id)

        returnJSON = addRacksTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(map(lambda x: x.make_json(), rack_list)),
        )
        return returnJSON
    except:
        raise
        return (addMessageToJSON(returnJSON, "Unable to retrieve rack data."),)


@racks.route("/create", methods=["POST"])
@requires_auth(request)
@log(request, LOGGER.RACKS, LOGGER.ACTIONS.RACKS.CREATE)
def create_racks():
    """ Create a range of racks """
    returnJSON = createJSON()
    data: JSON = request.get_json()
    print(request.get_json())

    try:
        start_letter: str = data[Constants.START_LETTER_KEY]
        stop_letter: str = data[Constants.STOP_LETTER_KEY]
        start_number: int = int(data[Constants.START_NUMBER_KEY])
        stop_number: int = int(data[Constants.STOP_NUMBER_KEY])

        datacenter_name: str = data[Constants.DC_NAME_KEY]
        datacenter_id = get_datacenter_id_by_name(datacenter_name)

        add_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
            datacenter_id=datacenter_id,
            datacenter_name=datacenter_name,
        )
        return addMessageToJSON(returnJSON, "success")
    except KeyError:
        return addMessageToJSON(returnJSON, "Unable to create racks.")
    except DBWriteException as e:
        return addMessageToJSON(returnJSON, e.message)
    except InvalidRangeError:
        return addMessageToJSON(
            returnJSON,
            "Invalid range of racks to add. Please make sure you provide a valid rack range.",
        )


@racks.route("/details", methods=["POST"])
@requires_auth(request)
def get_rack_details():
    """ Get details of a range of racks """
    data: JSON = request.get_json()

    try:
        start_letter: str = data[Constants.START_LETTER_KEY]
        stop_letter: str = data[Constants.STOP_LETTER_KEY]
        start_number: int = int(data[Constants.START_NUMBER_KEY])
        stop_number: int = int(data[Constants.STOP_NUMBER_KEY])

        datacenter_name: str = data[Constants.DC_NAME_KEY]
        datacenter_id = get_datacenter_id_by_name(datacenter_name)

        racks = get_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
            datacenter_id=datacenter_id,
            datacenter_name=datacenter_name,
        )

        pdf_file: str = DiagramManager().generate_diagram(rack_details=racks)
        return {Constants.MESSAGE_KEY: "success", "link": pdf_file}
    except KeyError:
        return {Constants.MESSAGE_KEY: "Unable to retrieve rack data."}
    except InvalidRangeError:
        return {
            Constants.MESSAGE_KEY: "Invalid range of racks to add. Please make sure you provide a valid rack range."
        }
    except RackDoesNotExistError as e:
        return {Constants.MESSAGE_KEY: e.message}


@racks.route("/delete", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
@log(request, LOGGER.RACKS, LOGGER.ACTIONS.RACKS.DELETE)
def delete_racks():
    """ Delete a range of racks """
    data: JSON = request.get_json()
    returnJSON = createJSON()

    try:
        start_letter: str = data[Constants.START_LETTER_KEY]
        stop_letter: str = data[Constants.STOP_LETTER_KEY]
        start_number: int = int(data[Constants.START_NUMBER_KEY])
        stop_number: int = int(data[Constants.STOP_NUMBER_KEY])

        datacenter_name: str = data[Constants.DC_NAME_KEY]
        datacenter_id = get_datacenter_id_by_name(datacenter_name)

        delete_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
            datacenter_id=datacenter_id,
            datacenter_name=datacenter_name,
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


@racks.route("/nextPDU", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def next_pdu_port():
    """ Returns first available PDU port for a given rack"""
    data: JSON = request.get_json()
    returnJSON = createJSON()

    rack_label = data.get(Constants.RACK_KEY)
    dc_name = data.get(Constants.DC_NAME_KEY)
    dc_id = get_datacenter_id_by_name(dc_name)

    rack_table: RackTable = RackTable()
    rack = rack_table.get_rack(rack_label, dc_id)
    if rack is None:
        return addMessageToJSON(returnJSON, "Failed to find rack")

    for i in range(0, 24):
        if rack.pdu_left[i] == 0 and rack.pdu_right[i] == 0:
            returnJSON["next_pair"] = str(i + 1)
            return addMessageToJSON(returnJSON, Constants.API_SUCCESS)

    returnJSON["next_pair"] = "No paris of PDU ports available."
    return addMessageToJSON(returnJSON, Constants.API_SUCCESS)


def get_datacenter_id_by_name(name):
    datacenter_id = DatacenterTable().get_datacenter_id_by_name(name)
    if datacenter_id is None:
        return -1
    return datacenter_id


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json[Constants.MESSAGE_KEY] = message
    return json


def addRacksTOJSON(json, rackArr: List[str]) -> dict:
    json["racks"] = rackArr
    return json
