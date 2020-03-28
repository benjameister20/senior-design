from typing import List

from app.change_plans.change_plan_action_manager import ChangePlanActionManager
from app.change_plans.change_plan_manager import ChangePlanManager
from app.constants import Constants
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


@changeplans.route("/changeplans/getplans", methods=["POST"])
@requires_auth(request)
def get_cps():
    """ Route for getting change plans associated with a user """
    global CP_MANAGER
    global cpArr
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        cp_list = CP_MANAGER.get_change_plans(cp_data)
        returnJSON = addCpsTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(map(lambda x: x.make_json(), cp_list)),
        )
        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


# ------------------------ CHANGE PLAN ACTION ROUTES ------------------------


@changeplans.route("/changeplans/createaction", methods=["POST"])
@requires_auth(request)
def create_cp_action():
    """ Route for creating a change plan action """
    global CP_ACTION_MANAGER
    returnJSON = createJSON()

    try:
        cp_action_data = request.get_json()
        CP_ACTION_MANAGER.create_change_plan_action(cp_action_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        print(e.message)
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/deleteaction", methods=["POST"])
@requires_auth(request)
def delete_cp_action():
    """ Route for deleting change plans """
    global CP_ACTION_MANAGER
    returnJSON = createJSON()

    try:
        cp_action_data = request.get_json()
        CP_ACTION_MANAGER.delete_change_plan_action(cp_action_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/getactions", methods=["POST"])
@requires_auth(request)
def get_cp_actions():
    """ Route for getting a change plan's actions """
    global CP_ACTION_MANAGER
    global cpActionsArr
    returnJSON = createJSON()

    try:
        cp_data = request.get_json()
        cp_id = cp_data.get(Constants.CHANGE_PLAN_ID_KEY)
        cp_action_list = CP_ACTION_MANAGER.get_change_plan_actions(cp_id)

        returnJSON = addCpActionsTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(map(lambda x: x.make_json(), cp_action_list)),
        )

        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@changeplans.route("/changeplans/editaction", methods=["POST"])
@requires_auth(request)
def edit_cp_action():
    """ Route for editing change plans """
    global CP_ACTION_MANAGER
    returnJSON = createJSON()

    try:
        cp_action_data = request.get_json()
        CP_ACTION_MANAGER.edit_change_plan_action(cp_action_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addCpsTOJSON(json, cpArr: List[str]) -> dict:
    json["change_plans"] = cpArr
    return json


def addCpActionsTOJSON(json, cpActionsArr: List[str]) -> dict:
    json["change_plan_actions"] = cpActionsArr
    return json
