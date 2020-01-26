from flask import Blueprint, request

models = Blueprint(
    "models", __name__, template_folder="templates", static_folder="static"
)


@models.route("/models/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@models.route("/models/create", methods=["POST"])
def create():
    """ Route for creating instances """

    # need model, hostname, rack, rack U
    # Optional: owner, comment

    model_data = request.get_json()

    # check rack exists
    # check instance can fit in rack

    print(model_data)

    return "happy"


@models.route("/models/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    # must be admin

    # Get primary key of instance (must exist)
    # Ask for confirmation
    # remove instance in db

    return "happy"


@models.route("/models/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    # get instances from db
    # need to paginate and be sortable

    return "happy"


@models.route("/models/detailview", methods=["POST"])
def detail_view():
    """ Route for table view of instances """

    # get instance from db (if exists)
    # return all details/info to frontend

    return "happy"
