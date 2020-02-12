class UserException(Exception):
    def __init__(self, message):
        self.message = message


class UsernameTakenError(UserException):
    def __init__(self, message):
        super().__init__(message)


class InvalidUsernameError(UserException):
    def __init__(self, message):
        super().__init__(message)


class InvalidPrivilegeError(UserException):
    def __init__(self, message):
        super().__init__(message)
