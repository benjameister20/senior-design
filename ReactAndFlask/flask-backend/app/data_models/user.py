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
        self, username: str, display_name: str, email: str, password, privilege: str,
    ) -> None:
        self.username: str = username
        self.display_name: str = display_name
        self.email: str = email
        self.password = password
        self.privilege: str = privilege

    def make_json(self) -> JSON:
        return {
            "username": self.username,
            "display_name": self.display_name,
            "email": self.email,
            "password": self.password.decode("utf-8"),
            "privilege": self.privilege,
        }

    def __repr__(self) -> str:
        return f"Username: {self.username}\nPassword: {self.password}\nDisplay Name: {self.display_name}\nEmail: {self.email}\nPrivilege: {self.privilege}"
