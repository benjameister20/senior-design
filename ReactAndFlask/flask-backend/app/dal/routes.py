from http import HTTPStatus
from typing import Optional

from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.dal.user_table import UserTable
from app.data_models.instance import Instance
from app.data_models.model import Model
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
        row_number: int = int(data["row_number"])

        rack: Rack = Rack(row_letter=row_letter, row_number=row_number)
        rack_table.add_rack(rack=rack)
    except:
        return HTTPStatus.BAD_REQUEST

    return HTTPStatus.OK


@database.route("/instance/<int:identifier>")
def instance(identifier: int):
    """ Get an instance """
    instance_table: InstanceTable = InstanceTable()

    instance: Optional[Instance] = instance_table.get_instance(identifier=identifier)
    if instance is None:
        return HTTPStatus.NOT_FOUND

    return instance.make_json()


@database.route("/instance/create", methods=["POST"])
def new_instance():
    """ Create a new instance """
    data: JSON = request.get_json()
    instance_table: InstanceTable = InstanceTable()

    try:
        model_id: int = int(data["model_id"])
        hostname: str = data["hostname"]
        row_letter: str = data["row_letter"]
        row_number: int = int(data["row_number"])
        rack_u: int = int(data["rack_u"])
        owner: Optional[str] = data.get("owner")
        comment: Optional[str] = data.get("comment")

        instance: Instance = Instance(
            model_id=model_id,
            hostname=hostname,
            rack=Rack(row_letter=row_letter, row_number=row_number),
            rack_u=rack_u,
            owner=owner,
            comment=comment,
        )
        instance_table.add_instance(instance=instance)
    except:
        return HTTPStatus.BAD_REQUEST

    return HTTPStatus.OK


@database.route("/model/<int:identifier>")
def model(identifier: int):
    """ Get a model """
    model_table: ModelTable = ModelTable()

    model: Optional[Model] = model_table.get_model(identifier=identifier)
    if model is None:
        return HTTPStatus.NOT_FOUND

    return model.make_json()


@database.route("/model/create", methods=["POST"])
def new_model():
    """ Create a new model """
    data: JSON = request.get_json()
    model_table: ModelTable = ModelTable()

    try:
        vendor: str = data["vendor"]
        model_number: str = data["model_number"]
        height: int = data["height"]
        eth_ports: Optional[int] = data.get("eth_ports")
        power_ports: Optional[int] = data.get("power_ports")
        cpu: Optional[str] = data.get("cpu")
        memory: Optional[int] = data.get("memory")
        storage: Optional[str] = data.get("storage")
        comment: Optional[str] = data.get("comment")
        display_color: str = data.get("display_color")

        model: Model = Model(
            vendor=vendor,
            model_number=model_number,
            height=height,
            eth_ports=eth_ports,
            power_ports=power_ports,
            cpu=cpu,
            memory=memory,
            storage=storage,
            comment=comment,
            display_color=display_color,
        )
        model_table.add_model(model=model)
    except:
        return HTTPStatus.BAD_REQUEST

    return HTTPStatus.OK
