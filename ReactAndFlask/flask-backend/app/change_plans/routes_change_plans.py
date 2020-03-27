from typing import List

from app.change_plans.change_plan_action_manager import ChangePlanActionManager
from app.change_plans.change_plan_manager import ChangePlanManager
from app.decorators.auth import requires_auth
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.logging.logger import Logger
from flask import Blueprint, request

changeplans = Blueprint(
    "changeplans", __name__, template_folder="templates", static_folder="static"
)

CP_MANAGER = ChangePlanManager()
CP_ACTION_MANAGER = ChangePlanActionManager()
LOGGER = Logger()


@changeplans.route("/changeplans/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@changeplans.route("/changeplans/createplan", methods=["POST"])
@requires_auth(request)
def create_Cp():
    """ Route for creating change plans """
    global CP_MANAGER
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        CP_MANAGER.create_change_plan(cp_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        print(e.message)
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/deleteplan", methods=["POST"])
@requires_auth(request)
def delete_cp():
    """ Route for deleting change plans """
    global CP_MANAGER
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        CP_MANAGER.delete_change_plan(cp_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/editplan", methods=["POST"])
@requires_auth(request)
def edit_cp():
    """ Route for editing change plans """
    global CP_MANAGER
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        CP_MANAGER.edit_change_plan(cp_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/execute", methods=["POST"])
@requires_auth(request)
def execute():
    """ Route for executing a change plans """
    global CP_MANAGER
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        CP_MANAGER.execute_cp(cp_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addInstancesTOJSON(json, cpArr: List[str]) -> dict:
    json["change_plans"] = cpArr
    return json
