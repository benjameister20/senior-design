from app.dal.datacenter_table import DBWriteException
from app.logging.logger import Logger
from app.permissions.permissions_manager import PermissionsManager
from flask import Blueprint

permissions = Blueprint(
    "permissions", __name__, template_folder="templates", static_folder="static"
)
LOGGER = Logger()
PM = PermissionsManager()


@permissions.route("/permissions/test", methods=["GET"])
# @requires_auth(request)
# @log
def test():
    """ route to test user endpoints """

    response = {}
    print("hello world")

    return add_message_to_JSON(response, "hello")


@permissions.route("/permissions/getPermissions", methods=["GET"])
def get_permissions():
    response = {}

    try:
        response = PM.get_permission_types()
    except DBWriteException as e:
        return add_message_to_JSON(response, e.message)
    except Exception as e:
        print(e)
        return add_message_to_JSON(response, "Failed to retrieve permission types")

    return add_message_to_JSON(response, "Successfully retrieved permission types")


def add_message_to_JSON(json, message) -> dict:
    json["message"] = message

    return json
