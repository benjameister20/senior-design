from typing import List

from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_manager import InstanceManager
from flask import Blueprint, request

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)

INSTANCE_MANAGER = InstanceManager()


@instances.route("/instances/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@instances.route("/instances/create", methods=["POST"])
def create():
    """ Route for creating instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        INSTANCE_MANAGER.create_instance(instance_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError:
        return addMessageToJSON(returnJSON, "failure")


@instances.route("/instances/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        INSTANCE_MANAGER.delete_instance(instance_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError:
        return addMessageToJSON(returnJSON, "failure")


@instances.route("/instances/search/", methods=["POST"])
def search():
    """ Route for searching instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    filter = request.json["filter"]
    try:
        limit = int(request.json["limit"])
    except:
        limit = 1000

    try:
        INSTANCE_MANAGER.get_instances(filter, limit)
        return addMessageToJSON(returnJSON, "success")
    except:
        return addMessageToJSON(returnJSON, "failure")


@instances.route("/instances/edit", methods=["POST"])
def edit():
    """ Route for editing instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        INSTANCE_MANAGER.edit_instance(instance_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError:
        return addMessageToJSON(returnJSON, "failure")


@instances.route("/instances/detailview", methods=["POST"])
def detail_view():
    """ Route for table view of instances """

    global instancesArr

    instance_data = request.get_json()
    instance = INSTANCE_MANAGER.detail_view(instance_data)

    returnJSON = createJSON()
    returnJSON = addInstancesTOJSON(addMessageToJSON(returnJSON, "success"), [instance])

    return returnJSON


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addInstancesTOJSON(json, instancesArr: List[str]) -> dict:
    json["instances"] = instancesArr
    return json
