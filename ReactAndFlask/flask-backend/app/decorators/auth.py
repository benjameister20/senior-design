from functools import wraps

import jwt
from app.constants import Constants
from app.dal.user_table import UserTable
from app.permissions.permissions_constants import PermissionConstants
from app.users.authentication import AuthManager

AUTH_MANAGER = AuthManager()
USER_TABLE = UserTable()

# class PermissionException(Exception):
#     def __init__(self, message):
#         self.message = message

# class InsufficientPermissionError(PermissionException):
#     def __init__(self, message):
#         super().__init__(message)


def requires_auth(request):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # print(request.headers)
                # print(request.headers["token"])
                # print(Constants.TOKEN_KEY)
                # print(request.headers.get(Constants.TOKEN_KEY))
                request.headers[Constants.TOKEN_KEY]
            except KeyError:
                # print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}

            is_validated = False
            message = ""
            try:
                is_validated, message = AUTH_MANAGER.validate_auth_token(
                    request.headers
                )
            except jwt.ExpiredSignatureError:
                return {Constants.MESSAGE_KEY: "Token expired, please login again."}
            except jwt.InvalidTokenError:
                return {
                    Constants.MESSAGE_KEY: "Token invalid, please provide a valid token."
                }
            except Exception:
                return {Constants.MESSAGE_KEY: "Could not verify authentication."}

            if not is_validated:
                return {Constants.MESSAGE_KEY: message}

            return f(*args, **kwargs)

        return wrapper

    return wrap


def requires_permission(request, permission):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # request.headers[Constants.PRIVILEGE_KEY]
                token = request.headers[Constants.TOKEN_KEY]
            except KeyError as e:
                print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}
            username = AUTH_MANAGER.decode_auth_token(token)
            user = USER_TABLE.get_user(username)
            if user is None:
                return {Constants.MESSAGE_KEY: f"User {username} does not exist"}

            user_permissions = user.privilege
            user_datacenters = user.datacenters
            try:
                datacenter_name = request.json.get(Constants.DC_NAME_KEY)
            except:
                datacenter_name = None
            # Check input permissions against permissions that the user has
            if not user_permissions[PermissionConstants.ADMIN]:
                # check bool permissions are satisfied
                for key in permission.make_json():
                    if permission[key] is True and user_permissions[key] is not True:
                        return {
                            Constants.MESSAGE_KEY: f"User {username} does not have {key} permission"
                        }

                # check datacenter permission satistifed
                if (
                    datacenter_name is not None
                    and "*" not in user_datacenters
                    and datacenter_name not in user_datacenters
                ):
                    return {
                        Constants.MESSAGE_KEY: f"User {username} does not have access to {datacenter_name} datacenter"
                    }

            return f(*args, **kwargs)

        return wrapper

    return wrap
