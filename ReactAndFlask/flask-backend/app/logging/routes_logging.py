from app.decorators.logs import log
from flask import Blueprint

logs = Blueprint("logs", __name__, template_folder="templates", static_folder="static")


@logs.route("/logs/test", methods=["GET"])
# @requires_auth(request)
@log
def test():
    """ route to test user endpoints """

    response = {}
    print("hello world")

    return add_message_to_JSON(response, "hello")


def add_message_to_JSON(json, message) -> dict:
    json["message"] = message

    return json
