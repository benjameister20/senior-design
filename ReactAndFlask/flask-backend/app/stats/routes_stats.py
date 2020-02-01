from app.stats.stats_manager import StatsManager
from flask import Blueprint

stats = Blueprint(
    "stats", __name__, template_folder="templates", static_folder="static"
)


@stats.route("/stats/test", methods=["GET"])
def test():
    """ route to test stats endpoints """
    return "happy"


STATS_MANAGER = StatsManager()


@stats.route("/stats/generate-report", methods=["GET"])
def generate_report():
    """ Route for generating usage report """

    global INSTANCE_MANAGER

    try:
        return STATS_MANAGER.create_report()
    except:
        return "Error generating usage report"
