from functools import wraps

from app.dal.user_table import UserTable
from app.users.authentication import AuthManager

AUTH_MANAGER = AuthManager()
USER_TABLE = UserTable()


def requires_auth(request):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                print(request.headers)
                request.headers["token"]
            except KeyError as e:
                print(str(e))
                return {"message": "Please provide auth token"}
            is_validated, message = AUTH_MANAGER.validate_auth_token(request.headers)
            if not is_validated:
                return {"message": message}

            return f(*args, **kwargs)

        return wrapper

    return wrap


def requires_role(request, role):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                request.headers["privilege"]
                token = request.headers["token"]
            except KeyError:
                return {"message": "Please provide auth token"}
            username = AUTH_MANAGER.decode_auth_token(token)
            user = USER_TABLE.get_user(username)
            if user is None:
                return {"message": f"User {username} does not exist"}
            if not user.privilege == role:
                print(user)
                print(request)
                return {"message": "Access denied"}
            return f(*args, **kwargs)

        return wrapper

    return wrap
