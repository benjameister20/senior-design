from http import HTTPStatus

from app.backups.routes_backups import backups
from app.change_plans.routes_change_plans import changeplans
from app.dal.database import db
from app.dal.routes import database
from app.datacenters.routes_datacenters import datacenters
from app.decommissions.routes_decommissions import decommissions
from app.import_export.routes import import_export
from app.instances.routes_instances import instances
from app.logging.routes_logging import logs
from app.models.routes_models import models
from app.permissions.routes_permissions import permissions
from app.racks.racks_routes import racks
from app.stats.routes_stats import stats
from app.users.authentication import AuthManager
from app.users.routes_users import users
from flask import Flask, jsonify, render_template
from flask_heroku import Heroku
from settings import TEST_DB_URL

application = Flask(__name__)
heroku = Heroku(app=application)
AUTH_MANAGER = AuthManager()


class FlaskApp(Flask):
    def make_response(self, rv):
        if isinstance(rv, dict):
            rv = jsonify(rv)
        elif (
            isinstance(rv, tuple)
            and isinstance(rv[0], dict)
            and isinstance(rv[1], HTTPStatus)
        ):
            rv[0]["status"] = rv[1]
            rv = jsonify(rv[0]), rv[1]
        elif isinstance(rv, HTTPStatus):
            rv = jsonify({"status": rv}), rv
        return super().make_response(rv)


application = FlaskApp(__name__)
application.url_map.strict_slashes = False
heroku = Heroku(app=application)


@application.route("/")
def index():
    # user = User(username="", display_name="", email="", password="", privilege="")
    return render_template("index.html")


@application.route("/test")
def test():
    return HTTPStatus.OK


def _register_routes() -> None:
    """
    Register routes
    """
    application.register_blueprint(users)
    application.register_blueprint(models)
    application.register_blueprint(instances)
    application.register_blueprint(racks)
    application.register_blueprint(database)
    application.register_blueprint(stats)
    application.register_blueprint(import_export)
    application.register_blueprint(logs)
    application.register_blueprint(datacenters)
    application.register_blueprint(decommissions)
    application.register_blueprint(changeplans)
    application.register_blueprint(backups)
    application.register_blueprint(permissions)


def init() -> None:
    application.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    if application.debug:
        application.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URL

    db.init_app(app=application)

    _register_routes()


if __name__ == "__main__":
    """
    Start the server
    """

    application.debug = True

    init()

    # Start the flask server, this runs until ctrl-c is pressed.
    #
    # `entire_network` will run your service in a way that will allow all devices
    # on the same network to connect to it. This is unsafe in particular if you
    # set debug=True, because any user of the application can execute arbitrary
    # Python code on your computer. If you trust the users on the network,
    # you can set this and access the app from, say, your phone.
    only_on_localhost = "localhost"
    on_entire_network = "0.0.0.0"

    application.run(on_entire_network, 4010)
elif __name__.startswith("uwsgi"):
    # Called from or uwsgi on start, initialize the server.
    init()
