from http import HTTPStatus
from typing import List

from app.dal.database import DBWriteException
from app.dal.rack_table import RackTable
from app.data_models.rack import Rack
from app.main.types import JSON
from app.racks.rack_manager import (
    InvalidRangeError,
    RackNotEmptyError,
    add_rack_range,
    delete_rack_range,
    get_rack_range,
)
from flask import Blueprint, request

racks = Blueprint(
    "racks",
    __name__,
    url_prefix="/racks",
    template_folder="templates",
    static_folder="static",
)


@racks.route("/all")
def get_all_racks():
    """ Get all racks """
    rack_table: RackTable = RackTable()
    rack_list: List[Rack] = rack_table.get_all_racks()

    return [rack.make_json() for rack in rack_list]


@racks.route("/create", methods=["POST"])
def create_racks():
    """ Create a range of racks """
    data: JSON = request.get_json()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        add_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )
    except KeyError:
        return HTTPStatus.BAD_REQUEST
    except (DBWriteException, InvalidRangeError):
        return HTTPStatus.INTERNAL_SERVER_ERROR

    return HTTPStatus.OK


@racks.route("/details", methods=["POST"])
def get_rack_details():
    """ Get details of a range of racks """
    data: JSON = request.get_json()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        return get_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )
    except KeyError:
        return HTTPStatus.BAD_REQUEST
    except InvalidRangeError:
        return HTTPStatus.INTERNAL_SERVER_ERROR


@racks.route("/delete", methods=["POST"])
def delete_racks():
    """ Delete a range of racks """
    data: JSON = request.get_json()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        delete_rack_range(
            start_letter=start_letter,
            stop_letter=stop_letter,
            start_number=start_number,
            stop_number=stop_number,
        )
    except KeyError:
        return HTTPStatus.BAD_REQUEST
    except (DBWriteException, InvalidRangeError, RackNotEmptyError):
        return HTTPStatus.INTERNAL_SERVER_ERROR

    return HTTPStatus.OK
