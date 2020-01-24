from flask import Blueprint, request
from password_manager import PasswordManager

users = Blueprint(
    "users", __name__, template_folder="templates", static_folder="static"
)

pwmg = PasswordManager()


@users.route("/users/test", methods=["GET"])
def test():
    """ route to test user endpoints """
    return "happy"


@users.route("/users/create", methods=["POST"])
def create():
    """Route for creating users

    Returns:
        string: Success or failure, if failure provide message
    """

    user_data = request.get_json()

    # Validate password
    if not pwmg.validate_pw(user_data["password"]):
        return "Failure: Invalid password"

    # TODO: Check if username is taken
    # reference database
    username_taken = False
    if username_taken:
        return "Failure: Username is taken"

    # TODO: Check if email is already associated with another account
    # reference database
    email_exists = False
    if email_exists:
        return "Failure: Email is already associated with another account"

    return "Success"


@users.route("/users/delete", methods=["POST"])
def delete():
    """Route for deleting users

    Returns:
        string: Success or failure, if failure provide message
    """

    request.get_json()

    return "Success"


@users.route("/users/edit", methods=["POST"])
def edit():
    return


@users.route("/users/authenticate", methods=["POST"])
def authenticate():
    """ Route for authenticating users """
    return
