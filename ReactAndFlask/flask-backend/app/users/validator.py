import re

from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.user_table import UserTable
from app.data_models.user import User
from app.exceptions.UserExceptions import (
    InvalidDatacenterError,
    InvalidEmailError,
    InvalidPasswordError,
    InvalidPrivilegeError,
    InvalidUsernameError,
    NoEditsError,
    UserException,
    UsernameTakenError,
)
from app.main.types import JSON
from app.permissions.permissions_constants import PermissionConstants

USER_TABLE = UserTable()
DC_TABLE = DatacenterTable()


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

    def validate_privilege(self, privilege: JSON, username: str) -> bool:

        # VALUE IN JSON COULD BE A STRING NOT A BOOL
        if username == "admin" and privilege[PermissionConstants.ADMIN] != True:
            raise InvalidPrivilegeError(
                "Cannot revoke admin permission from admin user"
            )

        for key in privilege:
            if key != PermissionConstants.DATACENTERS:
                if type(privilege[key]) is not bool:
                    raise TypeError(f"{key} must be of type bool.")
            else:
                if not isinstance(privilege[key], list):
                    raise TypeError(f"{key} must be of type dict.")

        return True

    def validate_datacenters(self, datacenters):
        for datacenter in datacenters:
            if datacenter != "*":
                dc = DC_TABLE.get_datacenter_by_name(datacenter)
                if dc is None:
                    raise InvalidDatacenterError(
                        f"Datacenter {datacenter} does not exist"
                    )

    def validate_create_user(self, user: User):
        self.validate_email(user.email)
        self.validate_password(user.password)
        self.validate_privilege(user.privilege, user.username)
        print("validated username and privilege")
        self.validate_new_username(user.username)
        print("validated username")
        if not (user.datacenters is None):
            self.validate_datacenters(user.datacenters)

        return True

    def validate_edit_user(self, user: User, original_username: str):
        old_user = self.validate_existing_username(original_username)

        # if old_user.password.decode("utf-8") == Constants.NETID_PASSWORD:
        #     raise UserException("Cannot edit NetID user")

        if old_user == user:
            raise NoEditsError("No edits made")

        if not (user.email == old_user.email):
            self.validate_email(user.email)

        # if user.password is not None:
        #     self.validate_password(user.password)

        if not (user.privilege == old_user.privilege):
            self.validate_privilege(user.privilege, user.username)

        if not (original_username == user.username):
            self.validate_new_username(user.username)

        if not (set(user.datacenters) == set(old_user.datacenters)):
            self.validate_datacenters(user.datacenters)

        user.password = old_user.password

        return [user, old_user]

    def validate_delete_user(self, user: User):

        if user.password.decode("utf-8") == Constants.NETID_PASSWORD:
            raise UserException("Cannot delete NetID user")

        if user is None:
            raise UserException(f"User '{user.username}' does not exist")

        return True

    def validate_shibboleth_login(self, user: User):
        # Upon shibboleth login
        # 1 check to see if a user with netid exists, if not create a new one
        # 2 check to see if that user has a password equal to "netid", if not, reject the new user
        # 3 make new user

        result = USER_TABLE.get_user(user.username)

        if result is None:
            return True

        if not result.password == user.password:
            raise UserException(f"User {user.username} already exists")

        return True
