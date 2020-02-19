from app.datacenters.datacenter_manager import DatacenterManager
from app.decorators.auth import requires_auth, requires_role
from app.exceptions.InvalidInputsException import InvalidInputsError
from flask import Blueprint, request

datacenters = Blueprint(
    "datacenters", __name__, template_folder="templates", static_folder="static"
)

DATACENTER_MANAGER = DatacenterManager()


@datacenters.route("/datacenters/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@datacenters.route("/datacenters/create/", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def create():
    """ Route for creating datacenters """
    DATACENTER_MANAGER
    returnJSON = createJSON()

    try:
        dc_data = request.get_json()
        error = DATACENTER_MANAGER.create_datacenter(dc_data)
        if error is not None:
            print(error.message)
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@datacenters.route("/datacenters/delete/", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def delete():
    """ Route for deleting datacenters """
    global DATACENTER_MANAGER
    returnJSON = createJSON()

    try:
        dc_data = request.get_json()
        DATACENTER_MANAGER.delete_datacenter(dc_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json
