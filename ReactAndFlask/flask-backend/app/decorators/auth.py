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
                request.headers["Authentication"]
            except KeyError:
                # return Response('Please provide auth token', 401, {'WWW-Authenticate': 'Basic realm="Login!"'})
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
                auth = request.headers["Authentication"]
            except KeyError:
                return {"message": "Please provide auth token"}
            username = AUTH_MANAGER.decode_auth_token(auth)
            user = USER_TABLE.get_user(username)
            if not user.privilege == role:
                return {"message": "Access denied"}
            return f(*args, **kwargs)

        return wrapper

    return wrap
