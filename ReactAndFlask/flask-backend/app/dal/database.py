from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class DBWriteException(Exception):
    """ Raised when a database write fails """

    def __init__(self, message: str = "Error writing to the database."):
        self.message: str = message
