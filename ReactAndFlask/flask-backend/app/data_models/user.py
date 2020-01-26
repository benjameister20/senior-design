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
