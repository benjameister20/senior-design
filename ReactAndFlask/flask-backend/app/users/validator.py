import re

from app.dal.user_table import UserTable
from app.data_models.user import User
from app.exceptions.UserExceptions import (
    InvalidEmailError,
    InvalidPasswordError,
    InvalidPrivilegeError,
    InvalidUsernameError,
    NoEditsError,
    UsernameTakenError,
)

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

        if not is_valid:
            raise InvalidPasswordError(
                "Password too weak. Passwords must contain uppercase and lowercase characters, numbers, special characters, and be 8 to 20 characters long"
            )

        return True

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

        if not is_valid:
            raise InvalidEmailError(
                f"Email '{email}' is invalid. Email addresses must comply with RFC 5322 Standard."
            )

        user = USER_TABLE.get_user_by_email(email)

        if user is not None:
            raise InvalidEmailError(
                f"Email '{email}' is already associated with a user account."
            )

        return True

    def validate_new_username(self, username: str) -> bool:
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
            raise InvalidUsernameError(
                f"Username '{username}' is not valid. Usernames must be between 4 and 20 characters, can only contain alphanumeric characters or special characters '.' and '_', cannot start with a special character, and cannot have doubles of special chacacters ('..' or '__')"
            )

        user = USER_TABLE.get_user(username)
        if user is not None:
            raise UsernameTakenError(f"Username '{username}' is already taken")

        return True

    def validate_existing_username(self, username: str) -> User:
        user = USER_TABLE.get_user(username)
        if user is None:
            raise InvalidUsernameError(f"User '{username}' does not exist")

        return user

    def validate_privilege(self, privilege: str, username: str) -> bool:

        if not (privilege == "admin" or privilege == "user"):
            raise InvalidPrivilegeError("Privilege levels are 'admin' and 'user'")

        if username == "admin" and privilege != "admin":
            raise InvalidPrivilegeError("Cannot edit admin privilege")

        return True

    def validate_create_user(self, user: User):
        self.validate_email(user.email)
        self.validate_password(user.password)
        self.validate_privilege(user.privilege, user.username)
        self.validate_new_username(user.username)

        return True

    def validate_edit_user(self, user: User, original_username: str):
        old_user = self.validate_existing_username(original_username)
        if old_user == user:
            raise NoEditsError("No edits made")

        if not (user.email == old_user.email):
            self.validate_email(user.email)
        if user.password is not None:
            self.validate_password(user.password)
        self.validate_privilege(user.privilege, user.username)
        if not (original_username == user.username):
            self.validate_new_username(user.username)

        user.password = old_user.password

        return [user, old_user]
