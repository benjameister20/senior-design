from app.models.model_manager import ModelManager
from flask import Blueprint, request

models = Blueprint(
    "models", __name__, template_folder="templates", static_folder="static"
)


mm = ModelManager()


@models.route("/models/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@models.route("/models/create", methods=["POST"])
def create():
    """ Route for creating instances """

    model_data = request.get_json()
    result = mm.create_model(model_data)

    return result


@models.route("/models/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    # takes vendor and model number
    model_data = request.get_json()
    result = mm.delete_model(model_data)

    return result


@models.route("/models/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    result = mm.view()

    return result


@models.route("/models/detailview", methods=["POST"])
def detail_view():
    """ Route for table view of instances """

    model_data = request.get_json()
    result = mm.detail_view(model_data)

    return result
