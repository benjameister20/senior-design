from functools import wraps

from app.constants import Constants
from app.exceptions.UserExceptions import UserException
from app.logging.logger import Logger
from app.users.authentication import AuthManager

LOGGER = Logger()
AUTHMANAGER = AuthManager()


def log(request, resource, action):
    def wrap(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # print(request)
            # print(request.json)
            # print(request.get_json())
            # print(request)
            token = request.headers.get(Constants.TOKEN_KEY)
            username = ""
            try:
                if action not in [
                    Logger.ACTIONS.USERS.AUTHENTICATE,
                    Logger.ACTIONS.USERS.OAUTH,
                ]:
                    username = AUTHMANAGER.decode_auth_token(token)
                else:
                    username = request.get_json().get(Constants.USERNAME_KEY)
            except UserException as e:
                return e.message

            # print(request.json)
            LOGGER.log_request(request.json, resource, action, username)
            response = f(*args, **kwargs)
            LOGGER.log_response(response)
            return response

        return wrapped

    return wrap
