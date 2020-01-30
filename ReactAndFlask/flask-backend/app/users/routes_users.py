from app.users.authentication import AuthManager
from app.users.validator import Validator
from flask import Blueprint, request

users = Blueprint(
    "users", __name__, template_folder="templates", static_folder="static"
)

auth_manager = AuthManager()
validator = Validator()


@users.route("/users/test", methods=["GET"])
def test():
    """ route to test user endpoints """

    response = {
        "users": [
            {
                "username": "jimmi",
                "display_name": "jimmi",
                "email": "jim@gmail.com",
                "password": "aS8!Dk4n#h33@",
                "privilege": "dsf",
            },
            {
                "username": "jimmi",
                "display_name": "jimmi",
                "email": "jim@gmail.com",
                "password": "aS8!Dk4n#h33@",
                "privilege": "dsf",
            },
        ],
        "token": 100,  # bookmarked location in database
    }

    return response


@users.route("/users/view", methods=["POST"])
def view(num_items):
    # TODO: query db for top <num_items> rows

    return None


@users.route("/users/create", methods=["POST"])
def create():
    """Route for creating users

    Username Criteria:
    - Between 4 and 20 characters
    - Contains only alphanumeric characters and ".", "_"
    - No "." or "_" at the beginning
    - No doubles of special characters (".." or "__")
    - Not already taken by another user

    Email Criteria:
    - Valid email address compliant with RCF 5322 standard
    - Not already associated with another account

    Password Criteria:
    - Contains at least one number.
    - Contains at least one uppercase and one lowercase character.
    - Contains at least one special symbol.
    - Between 8 to 20 characters long.


    Returns:
        string: Success or failure, if failure provide message
    """

    request_data = request.get_json()
    username = request_data["username"]
    password = request_data["password"]
    email = request_data["email"]
    request_data["display_name"]

    if not validator.validate_username(username):
        return "Failure: Invalid username"

    if not validator.validate_email(email):
        return "Failure: Invalid email address"

    if not validator.validate_password(password):
        return "Failure: Password too weak"

    # TODO: Store user as row in DB

    return "Success"


@users.route("/users/delete", methods=["POST"])
def delete():
    """Route for deleting users

    Returns:
        string: Success or failure, if failure provide message
    """

    request_data = request.get_json()
    request_data["username"]

    # TODO: delete user with username <username> from db

    return "Success"


@users.route("/users/edit", methods=["POST"])
def edit():

    request.get_json()
    request_data = request.get_json()
    request_data["username"]

    # TODO: delete and replace matching row from db with new values

    return "Success"


@users.route("/users/authenticate", methods=["POST"])
def authenticate():
    """ Route for authenticating users """

    request_data = request.get_json()

    request_data["username"]
    attempted_password = request_data["password"]

    # TODO: use username to get password from database
    db_password = auth_manager.encrypt_pw("aS8!Dk4n#h33@")

    auth_success = auth_manager.compare_pw(attempted_password, db_password)

    return str(auth_success)
