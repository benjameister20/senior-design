from app.data_models.permission import Permission
from app.decorators.auth import PermissionActions, requires_auth, requires_permission
from app.decorators.logs import log
from app.exceptions.UserExceptions import UserException
from app.logging.logger import Logger
from app.users.users_manager import UserManager
from flask import Blueprint, request

users = Blueprint(
    "users", __name__, template_folder="templates", static_folder="static"
)

USER_MANAGER = UserManager()
LOGGER = Logger()


@users.route("/users/test", methods=["GET"])
# @requires_auth(request)
def test():
    """ route to test user endpoints """

    response = {}

    return add_message_to_JSON(response, "hello")


@users.route("/users/search", methods=["POST"])
@requires_auth(request)
def search():
    response = {}
    try:
        json_list = USER_MANAGER.search(request)
        print(request)
        print(json_list)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return {"users": json_list}


@users.route("/users/create", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.CREATE)
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
    try:
        response = USER_MANAGER.create_user(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return response


@users.route("/users/delete", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.DELETE)
def delete():
    # TESTED AND FUNCTIONAL
    """Route for deleting users

    Returns:
        string: Success or failure, if failure provide message
    """

    response = {}
    try:
        response = USER_MANAGER.delete(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)
    print("response")
    print(response)
    return response


@users.route("/users/edit", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.EDIT)
def edit():

    response = {}
    print(request.get_json())
    try:
        response = USER_MANAGER.edit(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return response


@users.route("/users/authenticate", methods=["POST"])
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.AUTHENTICATE)
def authenticate():
    # TESTED AND FUNCTIONAL
    """ Route for authenticating users """

    response = {}
    try:
        response = USER_MANAGER.authenticate(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    # print(response)
    return response


@users.route("/users/oauth", methods=["POST"])
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.OAUTH)
def oauth():

    response = {}
    try:
        response = USER_MANAGER.oauth(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return response


@users.route("/users/logout", methods=["GET"])
@log(request, LOGGER.USERS, LOGGER.ACTIONS.USERS.LOGOUT)
def logout():

    response = {}
    try:
        response = USER_MANAGER.logout(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return response


@users.route("/users/detailView", methods=["POST"])
@requires_auth(request)
@requires_permission(
    request,
    Permission(
        model=False, asset=False, datacenters=[], power=False, audit=False, admin=True
    ),
    PermissionActions.NO_DATACENTER,
)
def detail_view():

    response = {}
    try:
        response = USER_MANAGER.detail_view(request)
    except UserException as e:
        return add_message_to_JSON(response, e.message)

    return response


def add_message_to_JSON(json, message) -> dict:
    json["message"] = message

    return json
