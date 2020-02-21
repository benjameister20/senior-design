from app.logging.logger import Logger
from flask import Blueprint

logs = Blueprint("logs", __name__, template_folder="templates", static_folder="static")
LOGGER = Logger()


@logs.route("/logs/test", methods=["GET"])
# @requires_auth(request)
# @log
def test():
    """ route to test user endpoints """

    response = {}
    print("hello world")

    return add_message_to_JSON(response, "hello")


@logs.route("/logs/get-logs", methods=["GET"])
def get_logs():
    response = {}

    try:
        response = LOGGER.get_logs()
    except Exception as e:
        print(e)
        return add_message_to_JSON(response, "Failed to retrieve logs")

    return add_message_to_JSON(response, "Successfully retrieved logs")


def add_message_to_JSON(json, message) -> dict:
    json["message"] = message

    return json
