from flask import Blueprint, request

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)


@instances.route("/instances/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@instances.route("/instances/create", methods=["POST"])
def create():
    """ Route for creating instances """

    # need model, hostname, rack, rack U
    # Optional: owner, comment

    instance_data = request.get_json()

    # check rack exists
    # check instance can fit in rack

    print(instance_data)

    return "happy"


@instances.route("/instances/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    # take rack and rack U
    request.get_json()

    # must be admin

    # Get primary key of instance (must exist)
    # Ask for confirmation
    # remove instance in db

    return "happy"


@instances.route("/instances/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    # get instances from db
    # need to paginate and be sortable

    return "happy"


@instances.route("/instances/detailview", methods=["POST"])
def detail_view():
    """ Route for detail view of instance """

    # take rack and rack U
    request.get_json()

    # get instance from db (if exists)
    # return all details/info to frontend

    return "happy"
