from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class DBWriteException(Exception):
    """ Raised when a database write fails """
