from functools import wraps

from app.exceptions.UserExceptions import UserException
from app.logging.logger import Logger
from app.users.authentication import AuthManager

LOGGER = Logger()
AUTHMANAGER = AuthManager()


def log(request, resource, action):
    def wrap(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            token = request.headers.get("token")
            username = ""
            try:
                if action not in [
                    Logger.ACTIONS.USERS.AUTHENTICATE,
                    Logger.ACTIONS.USERS.OAUTH,
                ]:
                    username = AUTHMANAGER.decode_auth_token(token)
                else:
                    username = request.get_json().get("username")
            except UserException as e:
                return e.message

            print(request.get_json())
            LOGGER.log_request(request.get_json(), resource, action, username)
            response = f(*args, **kwargs)
            LOGGER.log_response(response)
            return response

        return wrapped

    return wrap