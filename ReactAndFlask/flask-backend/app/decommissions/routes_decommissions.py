from typing import List

from app.decommissions.decommission_manager import DecommissionManager
from app.decorators.auth import requires_auth
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.logging.logger import Logger
from flask import Blueprint, request

decommissions = Blueprint(
    "decommissions", __name__, template_folder="templates", static_folder="static"
)

DECOMMISSION_MANAGER = DecommissionManager()
LOGGER = Logger()


@decommissions.route("/decommissions/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@decommissions.route("/decommissions/decommission_asset", methods=["POST"])
@requires_auth(request)
def decommission_asset():
    """ route to decommissioning an asset """
    global DECOMMISSION_MANAGER
    returnJSON = createJSON()

    try:
        asset_data = request.get_json()
        DECOMMISSION_MANAGER.decommission_asset(asset_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@decommissions.route("/decommissions/search", methods=["POST"])
@requires_auth(request)
def search():
    """ Route for searching decommissions """
    global DECOMMISSION_MANAGER
    global decommissionsArr
    returnJSON = createJSON()

    filter = request.json.get("filter")
    if filter is None:
        return addMessageToJSON(returnJSON, "Please include a filter")

    try:
        decommission_list = DECOMMISSION_MANAGER.get_decommissions(filter)
        returnJSON = addDecommissionTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(
                map(
                    lambda x: x.make_json_with_model_and_datacenter(), decommission_list
                )
            ),
        )
        return returnJSON
    except InvalidInputsError as e:
        print(e.message)
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addDecommissionTOJSON(json, decommissionsArr: List[str]) -> dict:
    json["decommissions"] = decommissionsArr
    return json
