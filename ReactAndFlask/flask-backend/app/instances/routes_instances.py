import json
from typing import List

from app.decorators.auth import requires_auth, requires_role
from app.decorators.logs import log
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_manager import InstanceManager
from app.logging.logger import Logger
from flask import Blueprint, request

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)

INSTANCE_MANAGER = InstanceManager()
LOGGER = Logger()


@instances.route("/instances/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@instances.route("/instances/search/", methods=["POST"])
@requires_auth(request)
def search():
    """ Route for searching instances """

    global INSTANCE_MANAGER
    global instancesArr
    returnJSON = createJSON()

    print("THIS ONE RIGHT HERE THIS ONE RIGHT HERE THIS ONE RIGHT HERE")
    print(request.json)
    filter = request.json["filter"]
    print("FILTER")
    print(filter)
    try:
        limit = int(request.json["limit"])
    except:
        limit = 1000

    try:
        print(request.json)
        datacenter_name = request.json["datacenter_name"]
        instance_list = INSTANCE_MANAGER.get_instances(filter, datacenter_name, limit)
        returnJSON = addInstancesTOJSON(
            addMessageToJSON(returnJSON, "success"),
            list(
                map(
                    lambda x: x.make_json_with_model_and_datacenter(
                        INSTANCE_MANAGER.get_model_from_id(x.model_id),
                        INSTANCE_MANAGER.get_dc_from_id(x.datacenter_id),
                    ),
                    instance_list,
                )
            ),
        )
        print(returnJSON)
        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/create", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
@log(request, LOGGER.INSTANCES, LOGGER.ACTIONS.INSTANCES.CREATE)
def create():
    """ Route for creating instances """
    print("REQUEST")
    print(request.get_json())
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        error = INSTANCE_MANAGER.create_instance(instance_data)
        print(type(error))
        if error is not None:
            print(error)
            print("YEEHAW")
            return addMessageToJSON(returnJSON, error)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/delete", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
@log(request, LOGGER.INSTANCES, LOGGER.ACTIONS.INSTANCES.DELETE)
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


@instances.route("/instances/edit", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
@log(request, LOGGER.INSTANCES, LOGGER.ACTIONS.INSTANCES.EDIT)
def edit():
    """ Route for editing instances """
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        print("REQUEST")
        print(instance_data)
        error = INSTANCE_MANAGER.edit_instance(instance_data)
        if error is not None:
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/detailView", methods=["POST"])
@requires_auth(request)
def detail_view():
    """ Route for table view of instances """
    print(json.dumps(request.json, indent=4))
    global INSTANCE_MANAGER
    global instancesArr
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        instance = INSTANCE_MANAGER.detail_view(instance_data)
        return addInstancesTOJSON(
            addMessageToJSON(returnJSON, "success"),
            [
                instance.make_json_with_model_and_datacenter(
                    INSTANCE_MANAGER.get_model_from_id(instance.model_id),
                    INSTANCE_MANAGER.get_dc_from_id(instance.datacenter_id),
                )
            ],
        )
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/assistedmodel", methods=["GET"])
@requires_auth(request)
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


@instances.route("/instances/nextAssetNumber", methods=["GET"])
@requires_auth(request)
@requires_role(request, "admin")
def get_next_asset_number():
    """ Route to get next valid asset number"""
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    returnJSON["asset_number"] = 583965
    return addMessageToJSON(returnJSON, "success")


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addInstancesTOJSON(json, instancesArr: List[str]) -> dict:
    json["instances"] = instancesArr
    return json
