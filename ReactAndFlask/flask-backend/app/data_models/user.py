from app.main.types import JSON


class User:
    """
    A data model for a User

    Attributes:
        username (str)
        display_name (str)
        email (str)
        password (str)
    """

    def __init__(
        self, username: str, display_name: str, email: str, password: str
    ) -> None:
        self.username: str = username
        self.display_name: str = display_name
        self.email: str = email
        self.password: str = password

    def make_json(self) -> JSON:
        return {
            "username": self.username,
            "display_name": self.display_name,
            "email": self.email,
            "password": self.password,
        }

    def __repr__(self) -> str:
        return f"Username: {self.username}\nPassword: {self.password}\nDisplay Name: {self.display_name}\nEmail: {self.email}\n"
