from http import HTTPStatus
from typing import Optional

from app.dal.rack_table import RackTable
from app.dal.user_table import UserTable
from app.data_models.rack import Rack
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
def new_user():
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


@database.route("/rack/<string:row_letter>-<string:row_number>")
def rack(row_letter: str, row_number):
    """ Get a rack """
    rack_table: RackTable = RackTable()

    rack: Optional[Rack] = rack_table.get_rack(
        row_letter=row_letter, row_number=row_number
    )
    if rack is None:
        return HTTPStatus.NOT_FOUND

    return rack.make_json()


@database.route("/rack/create", methods=["POST"])
def new_rack():
    """ Create a new rack """
    data: JSON = request.get_json()
    rack_table: RackTable = RackTable()

    try:
        row_letter: str = data["row_letter"]
        row_number: str = data["row_number"]

        rack: Rack = Rack(row_letter=row_letter, row_number=row_number)
        rack_table.add_rack(rack=rack)
    except:
        return HTTPStatus.BAD_REQUEST

    return HTTPStatus.OK
