from functools import wraps

from app.logging.logger import LoggerConstants


def log(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        print("Before decorated function")
        r = f(*args, **kwargs)
        print(r)
        print("After decorated function")
        return r

    return wrapped


@log
def say_hello():
    print("hello world")
    print(LoggerConstants.INSTANCES)


say_hello()
