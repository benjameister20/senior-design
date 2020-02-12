import re

from app.dal.user_table import UserTable
from app.exceptions.UserExceptions import (
    InvalidPrivilegeError,
    InvalidUsernameError,
    UsernameTakenError,
)

# TODO: implement error class to return from validator functions so can provide error messages for each situation

USER_TABLE = UserTable()


class Validator:
    def __init__(self) -> None:
        self.EMAIL_USED_MSG = "Email already associated with another account"
        self.EMAIL_INVALID_MSG = "Email invalid"
        self.USERNAME_INVALID_MSG = "Username invalid"
        self.USERNAME_TAKEN_MSG = "Username already taken"
        self.PASSWORD_INVALID_MSG = "Password too weak"

    def validate_password(self, password: str) -> bool:
        """Ensures password adheres to security guidelines:
            - Should have at least one number.
            - Should have at least one uppercase and one lowercase character.
            - Should have at least one special symbol.
            - Should be between 8 to 20 characters long.

            src: https://www.geeksforgeeks.org/password-validation-in-python/

        Args:
            password (string): Password to check

        Returns:
            Boolean: True if password adheres to guidelines, false if not
        """

        reg = (
            r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$"
        )
        pattern = re.compile(reg)
        is_valid = bool(re.search(pattern, password))

        return is_valid

    def validate_email(self, email: str) -> bool:
        """ Validates email address using following criteria

        Email Criteria:
        - Complies with RFC 5322 Standard
        - Not already associated with another account

        src: https://www.regular-expressions.info/email.html

        Args:
            email (str): Provided email address

        Returns:
            bool: True for successful validation, otherwise false
        """

        reg = r"\A[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\Z"
        pattern = re.compile(reg, re.IGNORECASE)
        is_valid = bool(re.search(pattern, email))

        user = USER_TABLE.get_user_by_email(email)
        if user is None:
            not_already_used = True
        else:
            not_already_used = False

        return is_valid and not_already_used

    def validate_username(self, username: str) -> bool:
        """ Validates username using following criteria:

        Username Criteria:
            - Between 4 and 20 characters
            - Contains only alphanumeric characters and ".", "_"
            - No "." or "_" at the beginning
            - No doubles of special characters (".." or "__")
            - Not already taken by another user


        src: https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username/12019115

        Args:
            username (str): Provided username

        Returns:
            bool: True for successful validation, otherwise false
        """

        reg = "^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
        pattern = re.compile(reg)
        is_valid = bool(re.search(pattern, username))
        if not is_valid:
            raise InvalidUsernameError(f"Username {username} is not valid")

        user = USER_TABLE.get_user(username)
        if user is not None:
            raise UsernameTakenError(f"Username {username} is already taken")

        return True

    def validate_privilege(self, privilege: str, username: str) -> bool:

        if not (privilege == "admin" or privilege == "user"):
            raise InvalidPrivilegeError("Privilege levels are 'admin' and 'user'")

        if username == "admin" and privilege != "admin":
            raise InvalidPrivilegeError("Cannot demote admin to 'user' privilege")

        return True
