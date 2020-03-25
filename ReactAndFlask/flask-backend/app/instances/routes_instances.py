import json
from typing import List

from app.constants import Constants
from app.data_models.permission import Permission
from app.decorators.auth import requires_auth, requires_permission
from app.decorators.logs import log
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.asset_num_generator import AssetNumGenerator
from app.instances.barcode_generator import BarcodeGenerator
from app.instances.instance_manager import InstanceManager
from app.logging.logger import Logger
from flask import Blueprint, request, send_from_directory

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)

INSTANCE_MANAGER = InstanceManager()
LOGGER = Logger()
ASSETNUMGEN = AssetNumGenerator()


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

    print(json.dumps(request.json, indent=4))
    print("")
    filter = request.json.get("filter")
    if filter is None:
        return addMessageToJSON(returnJSON, "Please include a filter")

    try:
        limit = int(request.json["limit"])
    except:
        limit = 1000

    try:
        print(request.json)
        datacenter_name = request.json["datacenter_name"]
        # if datacenter_name == "":
        #     print("IT WAS BLANK\n")
        #     datacenter_name = None
        instance_list = INSTANCE_MANAGER.get_instances(filter, datacenter_name, limit)
        # print(f"INSTANCE LIST: {instance_list}, {len(instance_list)}")
        # if len(instance_list) == 0:
        #     print("CAUGHT THE PROBLEM")
        #     return addMessageToJSON(returnJSON, "No instances to show")
        # print("INSTANCE LIST")
        # print(instance_list)
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
        print(json.dumps(returnJSON, indent=4))
        return returnJSON
    except InvalidInputsError as e:
        print(e.message)
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/create", methods=["POST"])
@requires_auth(request)
# @requires_permission(
#     request,
#     Permission(
#         model=False, asset=True, datacenters=[], power=False, audit=False, admin=False
#     ),
# )
@log(request, LOGGER.INSTANCES, LOGGER.ACTIONS.INSTANCES.CREATE)
def create():
    """ Route for creating instances """
    # print("REQUEST")
    # print(request.get_json())
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        instance_data = request.get_json()
        error = INSTANCE_MANAGER.create_instance(instance_data)
        print("ERROR")
        print(type(error))
        if error is not None:
            print(error)
            print("YEEHAW")
            return addMessageToJSON(returnJSON, error)
        print("MADE IT HERE")
        return addMessageToJSON(returnJSON, "success")
    except InvalidInputsError as e:
        print(e.message)
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/delete", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=True, datacenters=[], power=False, audit=False, admin=False
    ),
)
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
@requires_permission(
    request,
    Permission(
        model=False, asset=True, datacenters=[], power=False, audit=False, admin=False
    ),
)
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
        if instance is None:
            return addMessageToJSON(returnJSON, "Cannot view instance of type None")
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
# @requires_permission(
#     request,
#     Permission(
#         model=False, asset=True, datacenters=[], power=False, audit=False, admin=False
#     ),
# )
def get_next_asset_number():
    """ Route to get next valid asset number"""
    global INSTANCE_MANAGER
    returnJSON = createJSON()
    next_asset_number = 589382

    try:
        next_asset_number = ASSETNUMGEN.get_next_asset_number()
    except Exception as e:
        print(str(e))
        return addMessageToJSON(returnJSON, "Failed to get next asset number")

    print("NEXT ASSET NUMBER")
    print(next_asset_number)

    returnJSON["asset_number"] = next_asset_number
    return addMessageToJSON(returnJSON, "success")


@instances.route("/instances/networkNeighborhood", methods=["POST"])
@requires_auth(request)
def get_network_neighborhood():
    """ Route to get network neighborhood"""
    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        asset_data = request.get_json()
        returnJSON = INSTANCE_MANAGER.get_network_neighborhood(
            asset_data[Constants.ASSET_NUMBER_KEY]
        )
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@instances.route("/instances/labelgen", methods=["POST"])
# @requires_auth(request)
def get_barcode_labels():
    """ Route to get barcode labels for assets"""
    returnJSON = createJSON()
    try:
        asset_data = request.get_json()
        print(asset_data)
        BarcodeGenerator().create_barcode_labels(asset_data)
        return send_from_directory(
            directory="static/", filename="asset_labels.pdf", as_attachment=True,
        )
        # return addMessageToJSON(returnJSON, "success")
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
