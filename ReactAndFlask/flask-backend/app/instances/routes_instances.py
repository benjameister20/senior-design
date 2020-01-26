from app.instances.instance_manager import InstanceManager
from flask import Blueprint, request

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)

im = InstanceManager()


@instances.route("/instances/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@instances.route("/instances/create", methods=["POST"])
def create():
    """ Route for creating instances """

    instance_data = request.get_json()
    result = im.create_instance(instance_data)

    return result


@instances.route("/instances/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    instance_data = request.get_json()
    result = im.delete_instance(instance_data)

    return result


@instances.route("/instances/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    result = im.view()

    return result


@instances.route("/instances/detailview", methods=["POST"])
def detail_view():
    """ Route for detail view of instance """

    instance_data = request.get_json()
    result = im.detail_view(instance_data)

    return result
