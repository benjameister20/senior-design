from typing import List

from app.constants import Constants
from app.data_models.permission import Permission
from app.datacenters.datacenter_manager import DatacenterManager
from app.decorators.auth import PermissionActions, requires_auth, requires_permission
from app.decorators.logs import log
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.logging.logger import Logger
from flask import Blueprint, request

datacenters = Blueprint(
    "datacenters", __name__, template_folder="templates", static_folder="static"
)

DATACENTER_MANAGER = DatacenterManager()
LOGGER = Logger()


@datacenters.route("/datacenters/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@datacenters.route("/datacenters/all/", methods=["GET"])
@requires_auth(request)
def list_all():
    """ Route for returning all datacenters """
    global DATACENTER_MANAGER
    global dcArr
    returnJSON = createJSON()

    try:
        dc_list = DATACENTER_MANAGER.get_all_datacenters()
        returnJSON = addDatacentersTOJSON(
            addMessageToJSON(returnJSON, Constants.API_SUCCESS),
            list(map(lambda x: x.make_json(), dc_list)),
        )
        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@datacenters.route("/datacenters/create/", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.DATACENTERS, LOGGER.ACTIONS.DATACENTERS.CREATE)
def create():
    """ Route for creating datacenters"""

    global DATACENTER_MANAGER
    returnJSON = createJSON()

    try:
        dc_data = request.get_json()
        error = DATACENTER_MANAGER.create_datacenter(dc_data)
        if error is not None:
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@datacenters.route("/datacenters/edit/", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.DATACENTERS, LOGGER.ACTIONS.DATACENTERS.EDIT)
def edit():
    """ Route for creating datacenters """
    global DATACENTER_MANAGER
    returnJSON = createJSON()

    try:
        dc_data = request.get_json()
        error = DATACENTER_MANAGER.edit_datacenter(dc_data)
        if error is not None:
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@datacenters.route("/datacenters/delete/", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.DATACENTERS, LOGGER.ACTIONS.DATACENTERS.DELETE)
def delete():
    """ Route for deleting datacenters """
    global DATACENTER_MANAGER
    returnJSON = createJSON()

    try:
        dc_data = request.get_json()
        error = DATACENTER_MANAGER.delete_datacenter(dc_data)
        if error is not None:
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json[Constants.MESSAGE_KEY] = message
    return json


def addDatacentersTOJSON(json, dcArr: List[str]) -> dict:
    json["datacenters"] = dcArr
    return json
