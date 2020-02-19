from functools import wraps

from app.logging.logger import Logger

LOGGER = Logger()


def log(request, resource, action):
    def wrap(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # print("Before decorated function")
            LOGGER.log_request(request.get_json(), resource, action)
            response = f(*args, **kwargs)
            LOGGER.log_response(response)
            # print("After decorated function")
            return response

        return wrapped

    return wrap


# # @log
# def say_hello():
#     print("hello world")
#     # print(LoggerConstants.INSTANCES)


# say_hello()
