from http import HTTPStatus

# from app.instances.routes_instances import instances
# from app.models.routes_models import models
# from app.racks.routes_racks import racks
# from app.stats.routes_stats import stats
# from app.users.routes_users import users
from flask import Flask, Response, jsonify, make_response, render_template

application = Flask(__name__)


class APIResponse(Response):
    @classmethod
    def force_type(cls, rv, environ=None):
        if isinstance(rv, dict):
            rv = jsonify(rv)
        elif (
            isinstance(rv, tuple)
            and isinstance(rv[0], dict)
            and isinstance(rv[1], HTTPStatus)
        ):
            rv = make_response(jsonify(rv[0]), rv[1])
        elif isinstance(rv, HTTPStatus):
            rv = make_response(jsonify({}), rv)

        return super(APIResponse, cls).force_type(rv, environ)


application.response_class = APIResponse
application.url_map.strict_slashes = False


@application.route("/")
def index():
    return render_template("index.html")


def _register_routes() -> None:
    """
    Register routes
    """
    # application.register_blueprint(users)
    # application.register_blueprint(models)
    # application.register_blueprint(instances)
    # application.register_blueprint(racks)
    # application.register_blueprint(stats)


def init() -> None:
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
