from typing import List

from app.constants import Constants
from app.main.types import JSON


class User:
    """
    A data model for a User

    Attributes:
        username (str)
        display_name (str)
        email (str)
        password (str)
        privilege (str)
    """

    def __init__(
        self,
        username: str,
        display_name: str,
        email: str,
        password,
        privilege: JSON,
        datacenters,
    ) -> None:
        self.username: str = username
        self.display_name: str = display_name
        self.email: str = email
        self.password = password
        # self.privilege: str = privilege
        self.privilege: JSON = privilege
        self.datacenters: List[str] = datacenters

    def make_json(self) -> JSON:
        return {
            Constants.USERNAME_KEY: self.username,
            Constants.DISPLAY_NAME_KEY: self.display_name,
            Constants.EMAIL_KEY: self.email,
            Constants.PASSWORD_KEY: self.password.decode("utf-8"),
            Constants.PRIVILEGE_KEY: self.privilege,
            Constants.PERMISSIONS_DC_KEY: self.datacenters,
        }

    def __repr__(self) -> str:
        return f"Username: {self.username}\nPassword: {self.password}\nDisplay Name: {self.display_name}\nEmail: {self.email}\nPrivilege: {self.privilege}\nDatacenters: {self.datacenters}"

    def __eq__(self, user):
        is_username = self.username == user.username
        is_email = self.email == user.email
        is_display_name = self.display_name == user.display_name
        # is_privilege = self.privilege == user.privilege
        is_privilege = True
        print("self", self.privilege)
        print("other", user.privilege)
        for key in self.privilege:
            if self.privilege[key] != user.privilege[key]:
                is_privilege = False
                break
        is_datacenters = set(self.datacenters) == set(user.datacenters)

        return (
            is_username
            and is_email
            and is_display_name
            and is_privilege
            and is_datacenters
        )
