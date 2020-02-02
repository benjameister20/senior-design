import json
import os

from app.dal.user_table import UserTable
from app.data_models.user import User
from app.decorators.auth import requires_auth, requires_role
from app.users.authentication import AuthManager
from app.users.validator import Validator
from flask import Blueprint, request

users = Blueprint(
    "users", __name__, template_folder="templates", static_folder="static"
)

AUTH_MANAGER = AuthManager()
VALIDATOR = Validator()
USER_TABLE = UserTable()

blacklist_file = "/token_blacklist.json"
dirname = os.path.dirname(__file__)
BLACKLIST = []
print(dirname)
with open(dirname + blacklist_file, "r") as infile:
    contents = json.load(infile)
    BLACKLIST = contents.get("blacklist")


@users.route("/users/test", methods=["GET"])
# @requires_auth(request)
def test():
    """ route to test user endpoints """

    response = {}

    return add_message_to_JSON(response, "hello")


@users.route("/users/search", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def search():
    # TESTED AND FUNCTIONAL
    # print(request.headers)
    request_data = request.get_json()
    filters = request_data.get("filter")
    limit = filters.get("limit")
    if limit is None:
        limit = 1000

    users = USER_TABLE.search_users(
        username=filters.get("username"),
        display_name=filters.get("display_name"),
        email=filters.get("email"),
        privilege=filters.get("privilege"),
        limit=limit,
    )

    json_list = [user.make_json() for user in users]

    return {"users": json_list}


@users.route("/users/create", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def create():
    # TESTED AND FUNCTIONAL
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

    response = {}

    # print(request)
    request_data = request.get_json()
    # print(request_data)
    try:
        username = request_data["username"]
        password = request_data["password"]
        email = request_data["email"]
        display_name = request_data["display_name"]
        privilege = request_data["privilege"]
    except:
        return add_message_to_JSON(
            response, "Incorrectly formatted message. Application error on the frontend"
        )

    if not VALIDATOR.validate_username(username):
        return add_message_to_JSON(response, "Invalid username")

    if not VALIDATOR.validate_email(email):
        return add_message_to_JSON(response, "Invalid email address")

    if not VALIDATOR.validate_password(password):
        return add_message_to_JSON(response, "Password too weak")

    try:
        encrypted_password = AUTH_MANAGER.encrypt_pw(password)

        user = User(username, display_name, email, encrypted_password, privilege)
        USER_TABLE.add_user(user)
    except:
        return add_message_to_JSON(response, "Server error. Please try again later...")

    return add_message_to_JSON(response, "success")


@users.route("/users/delete", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def delete():
    # TESTED AND FUNCTIONAL
    """Route for deleting users

    Returns:
        string: Success or failure, if failure provide message
    """

    response = {}

    request_data = request.get_json()
    username = request_data["username"]

    user = USER_TABLE.get_user(username)
    if user is None:
        return add_message_to_JSON(
            response, "User <{}> does not exist".format(username)
        )

    USER_TABLE.delete_user(user)

    return add_message_to_JSON(response, "success")


@users.route("/users/edit", methods=["POST"])
@requires_auth(request)
@requires_role(request, "admin")
def edit():
    # TESTED AND FUNCTIONAL

    response = {}

    # TODO: check
    request_data = request.get_json()
    username = request_data["username"]
    display_name = request_data["display_name"]
    email = request_data["email"]
    password = request_data["password"]
    privilege = request_data["privilege"]

    user = USER_TABLE.get_user(username)
    if user is None:
        return add_message_to_JSON(
            response, "User <{}> does not exist".format(username)
        )

    # check for change of password
    if (
        password != ""
        and password is not None
        and not AUTH_MANAGER.compare_pw(password, user.password)
    ):
        if VALIDATOR.validate_password(password):
            password = AUTH_MANAGER.encrypt_pw(password)
        else:
            return {"message": "Password invalid"}
    else:
        password = user.password

    updated_user = User(
        username=username,
        display_name=display_name,
        email=email,
        password=password,
        privilege=privilege,
    )
    USER_TABLE.delete_user(user)
    USER_TABLE.add_user(updated_user)

    return add_message_to_JSON(response, "success")


@users.route("/users/authenticate", methods=["POST"])
def authenticate():
    # TESTED AND FUNCTIONAL
    """ Route for authenticating users """

    answer = {}
    print(request)

    try:
        request_data = request.get_json()
        username = request_data["username"]
        attempted_password = request_data["password"]
    except:
        return add_message_to_JSON(
            answer, "Connection error. Please try again later..."
        )

    user = USER_TABLE.get_user(username)
    if user is None:
        return add_message_to_JSON(answer, "User <{}> does not exist".format(username))

    auth_success = AUTH_MANAGER.compare_pw(attempted_password, user.password)
    if not auth_success:
        return add_message_to_JSON(answer, "Incorrect password")

    answer["token"] = AUTH_MANAGER.encode_auth_token(username)
    answer["privilege"] = user.privilege

    return add_message_to_JSON(answer, "success")


@users.route("/users/logout", methods=["GET"])
def logout():

    response = {}

    token = request.headers.get("token")
    BLACKLIST.append(token)
    # print(BLACKLIST)

    with open(dirname + blacklist_file, "w") as outfile:
        json.dump({"blacklist": BLACKLIST}, outfile, indent=4)

    return add_message_to_JSON(response, "Successfully logged out")


@users.route("/users/detailView", methods=["POST"])
def detail_view():

    response = {}

    request_data = request.get_json()
    username = request_data.get("username")
    if username is None:
        return add_message_to_JSON(response, "Please provide a username")

    user = USER_TABLE.get_user(username)
    if user is None:
        return add_message_to_JSON(
            response, "User <{}> does not exist".format(username)
        )

    response["user"] = user.make_json()

    return response


def add_message_to_JSON(json, message) -> dict:
    json["message"] = message

    return json
