from flask import Blueprint, request

racks = Blueprint(
    "racks", __name__, template_folder="templates", static_folder="static"
)


@racks.route("/racks/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@racks.route("/racks/create", methods=["POST"])
def create():
    """ Route for creating users """

    user_data = request.get_json()

    print(user_data)

    # TODO: Check if username is taken
    # TODO: Check if email is already associated with another account
    # TODO: Check if password is secure enough (uppercase + lowercase, numbers, special chars, length)

    # use crypto library to securely store user info in db

    return "happy"


@racks.route("/racks/delete", methods=["POST"])
def delete():
    """ Route for deleting users """

    request.args.get("username")
    request.args.get("display_name")
    request.args.get("email")
    request.args.get("password")
    request.args.get("privilege")

    # use crypto library to securely store user info

    # store user in db

    return
