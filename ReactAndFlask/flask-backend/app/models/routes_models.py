import json
from typing import List

from app.constants import Constants
from app.data_models.permission import Permission
from app.decorators.auth import requires_auth, requires_permission
from app.decorators.logs import log
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.logging.logger import Logger
from app.models.model_manager import ModelManager
from flask import Blueprint, request

models = Blueprint(
    "models", __name__, template_folder="templates", static_folder="static"
)

MODEL_MANAGER = ModelManager()
LOGGER = Logger()


@models.route("/models/test", methods=["GET"])
def test():
    """ route to test model endpoints """
    return "test"


@models.route("/models/create", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=True, asset=False, datacenters=[], power=False, audit=False, admin=False
    ),
)
@log(request, LOGGER.MODELS, LOGGER.ACTIONS.MODELS.CREATE)
def create():
    """ Route for creating models """

    global MODEL_MANAGER
    returnJSON = createJSON()

    try:
        model_data = request.get_json()
        MODEL_MANAGER.create_model(model_data)

        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@models.route("/models/delete", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=True, asset=False, datacenters=[], power=False, audit=False, admin=False
    ),
)
@log(request, LOGGER.MODELS, LOGGER.ACTIONS.MODELS.DELETE)
def delete():
    """ Route for deleting models """

    global MODEL_MANAGER
    returnJSON = createJSON()

    try:
        model_data = request.get_json()
        print("Model data: ")
        print(model_data)
        error = MODEL_MANAGER.delete_model(model_data)
        if error is None:
            return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
        else:
            return addMessageToJSON(returnJSON, error.message)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@models.route("/models/search/", methods=["POST"])
@requires_auth(request)
def search():
    """ Route for searching models """

    global MODEL_MANAGER
    global modelsArr
    returnJSON = createJSON()
    print(json.dumps(request.json, indent=4))

    filter = request.json[Constants.FILTER_KEY]
    print("filter")
    print(filter)
    try:
        limit = int(request.json[Constants.LIMIT_KEY])
    except:
        limit = 1000

    try:
        model_list = MODEL_MANAGER.get_models(filter, limit)
        returnJSON = addModelsTOJSON(
            addMessageToJSON(returnJSON, Constants.API_SUCCESS),
            list(map(lambda x: x.make_json(), model_list)),
        )
        return returnJSON
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@models.route("/models/edit", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=True, asset=False, datacenters=[], power=False, audit=False, admin=False
    ),
)
@log(request, LOGGER.MODELS, LOGGER.ACTIONS.MODELS.EDIT)
def edit():
    """ Route for editing models """

    global MODEL_MANAGER
    returnJSON = createJSON()

    try:
        model_data = request.get_json()
        error = MODEL_MANAGER.edit_model(model_data)

        if error is not None:
            return addMessageToJSON(returnJSON, error.message)
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@models.route("/models/detailView", methods=["POST"])
@requires_auth(request)
def detail_view():
    """ Route for table view of models """

    global MODEL_MANAGER
    global modelsArr
    returnJSON = createJSON()

    try:
        model_data = request.get_json()
        model = MODEL_MANAGER.detail_view(model_data)
        return addModelsTOJSON(
            addMessageToJSON(returnJSON, Constants.API_SUCCESS), [model.make_json()]
        )
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


@models.route("/models/assistedvendor", methods=["GET"])
@requires_auth(request)
def assisted_vendor_input():
    global MODEL_MANAGER
    returnJSON = createJSON()

    try:
        prefix_json = request.get_json()
        vendor_list = MODEL_MANAGER.get_distinct_vendors_with_prefix(prefix_json)
        returnJSON["results"] = vendor_list
        return addMessageToJSON(returnJSON, Constants.API_SUCCESS)
    except InvalidInputsError as e:
        return addMessageToJSON(returnJSON, e.message)


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json[Constants.MESSAGE_KEY] = message
    return json


def addModelsTOJSON(json, modelsArr: List[str]) -> dict:
    json["models"] = modelsArr
    return json
