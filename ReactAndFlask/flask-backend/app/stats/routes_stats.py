import json

from app.constants import Constants
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


@stats.route("/stats/generate-report", methods=["POST"])
@requires_auth(request)
def generate_report():
    """ Route for generating usage report """
    print("GENERATING REPORT")
    print(json.dumps(request.json, indent=4))

    global INSTANCE_MANAGER
    returnJSON = createJSON()

    try:
        datacenter_name = request.json[Constants.DC_NAME_KEY]
    except:
        datacenter_name = ""

    try:
        report = STATS_MANAGER.create_report(datacenter_name)
        addMessageToJSON(returnJSON, "success")
        return report
    except ValueError as e:
        return addMessageToJSON(returnJSON, str(e))
    except Exception as e:
        print(e)
        return addMessageToJSON(
            returnJSON,
            "Could not generate a report. Please make sure there is at least one datacenter with racks.",
        )


def createJSON() -> dict:
    return {"metadata": "none"}


def addMessageToJSON(json, message) -> dict:
    json["message"] = message
    return json


def addReportTOJSON(json, report) -> dict:
    json["report"] = report
    return json
