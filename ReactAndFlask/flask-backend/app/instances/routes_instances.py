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

    # try:
    instance_data = request.get_json()
    error = INSTANCE_MANAGER.create_instance(instance_data)
    if error is not None:
        return addMessageToJSON(returnJSON, error.message)
    return addMessageToJSON(returnJSON, "success")
    # except InvalidInputsError as e:
    #     return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        INSTANCE_MANAGER.delete_instance(instance_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/search/", methods=["POST"])
def search():
    """ Route for searching instances """

    global INSTANCE_MANAGER
    global instancesArr
    returnJSON = createJSON()

    filter = request.json["filter"]
    try:
        limit = int(request.json["limit"])
    except:
        limit = 1000

    try:
        instance_list = INSTANCE_MANAGER.get_instances(filter, limit)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)

    returnJSON = addInstancesTOJSON(
        addMessageToJSON(returnJSON, "success"),
        list(map(lambda x: x.make_json(), instance_list)),
    )
    return returnJSON


@instances.route("/instances/edit", methods=["POST"])
def edit():
    """ Route for editing instances """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        INSTANCE_MANAGER.edit_instance(instance_data)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/detailView", methods=["POST"])
def detail_view():
    """ Route for table view of instances """

    global INSTANCE_MANAGER
    global instancesArr
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        instance = INSTANCE_MANAGER.detail_view(instance_data)
        return addInstancesTOJSON(
            addMessageToJSON(returnJSON, "success"), [instance.make_json()]
        )
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/assistedmodel", methods=["GET"])
def assisted_model_input():
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        prefix_json = request.get_json()
        model_list = INSTANCE_MANAGER.get_possible_models_with_filters(prefix_json)
        returnJSON["results"] = model_list
        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addInstancesTOJSON(json, instancesArr: List[str]) -> dict:
    json["instances"] = instancesArr
    return json
