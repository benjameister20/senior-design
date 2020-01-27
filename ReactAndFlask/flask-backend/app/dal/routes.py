from http import HTTPStatus
from typing import Optional

from app.dal.user_table import UserTable
from app.data_models.user import User
from app.main.types import JSON
from flask import Blueprint, request

database = Blueprint("db", __name__, url_prefix="/db")


@database.route("/user/<string:username>")
def user(username: str):
    """ Get a user """
    user_table: UserTable = UserTable()

    user: Optional[User] = user_table.get_user(username=username)
    if user is None:
        return HTTPStatus.NOT_FOUND

    return user.make_json()


@database.route("/user/create", methods=["POST"])
def create():
    """ Create a new user """
    data: JSON = request.get_json()
    user_table: UserTable = UserTable()

    try:
        username: str = data["username"]
        password: str = data["password"]
        display_name: str = data["display_name"]
        email: str = data["email"]

        user: User = User(
            username=username, display_name=display_name, email=email, password=password
        )
        user_table.add_user(user=user)
    except:
        return HTTPStatus.BAD_REQUEST

    return HTTPStatus.OK
