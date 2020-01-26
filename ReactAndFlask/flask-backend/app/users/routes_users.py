from flask import Blueprint, request

users = Blueprint(
    "users", __name__, template_folder="templates", static_folder="static"
)


@users.route("/users/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@users.route("/users/create", methods=["POST"])
def create():
    """ Route for creating users """

    user_data = request.get_json()

    print(user_data)

    # TODO: Check if username is taken
    # TODO: Check if email is already associated with another account
    # TODO: Check if password is secure enough (uppercase + lowercase, numbers, special chars, length)

    # use crypto library to securely store user info in db

    return "happy"


@users.route("/users/delete", methods=["POST"])
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


@users.route("/users/authenticate", methods=["POST"])
def authenticate():
    """ Route for authenticating users """
