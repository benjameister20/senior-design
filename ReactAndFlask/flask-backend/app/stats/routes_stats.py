from app.decorators.auth import requires_auth
from app.stats.stats_manager import StatsManager
from flask import Blueprint, request

stats = Blueprint(
    "stats", __name__, template_folder="templates", static_folder="static"
)


@stats.route("/stats/test", methods=["GET"])
def test():
    """ route to test stats endpoints """
    return "happy"


STATS_MANAGER = StatsManager()


@stats.route("/stats/generate-report", methods=["GET"])
@requires_auth(request)
def generate_report():
    """ Route for generating usage report """

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        report = STATS_MANAGER.create_report()
        addMessageToJSON(returnJSON, "success")
        return report
    except ValueError as e:
        return addMessageToJSON(returnJSON, str(e))
    except:
        return addMessageToJSON(returnJSON, "Error generating usage report")


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addReportTOJSON(json, report) -> dict:
    json["report"] = report
    return json
