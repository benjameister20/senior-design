from functools import wraps

from app.constants import Constants
from app.dal.user_table import UserTable
from app.users.authentication import AuthManager

AUTH_MANAGER = AuthManager()
USER_TABLE = UserTable()


def requires_auth(request):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # print(request.headers)
                request.headers[Constants.TOKEN_KEY]
            except KeyError as e:
                print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}
            is_validated, message = AUTH_MANAGER.validate_auth_token(request.headers)
            if not is_validated:
                return {Constants.MESSAGE_KEY: message}

            return f(*args, **kwargs)

        return wrapper

    return wrap


def requires_role(request, role):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                request.headers[Constants.PRIVILEGE_KEY]
                token = request.headers[Constants.TOKEN_KEY]
            except KeyError as e:
                print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}
            username = AUTH_MANAGER.decode_auth_token(token)
            user = USER_TABLE.get_user(username)
            if user is None:
                return {Constants.MESSAGE_KEY: f"User {username} does not exist"}
            if not user.privilege == role:
                return {Constants.MESSAGE_KEY: "Access denied"}

            return f(*args, **kwargs)

        return wrapper

    return wrap
