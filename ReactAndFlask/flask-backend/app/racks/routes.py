import string
from http import HTTPStatus
from typing import List

from app.dal.database import DBWriteException
from app.dal.rack_table import RackTable
from app.data_models.rack import Rack
from app.main.types import JSON
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
    rack_table: RackTable = RackTable()

    try:
        start_letter: str = data["start_letter"]
        stop_letter: str = data["stop_letter"]
        start_number: int = int(data["start_number"])
        stop_number: int = int(data["stop_number"])

        if (not start_letter.isalpha) or (not stop_letter.isalpha):
            return HTTPStatus.BAD_REQUEST

        if start_number < 1 or start_number > stop_number:
            return HTTPStatus.BAD_REQUEST

        alphabet: str = string.ascii_uppercase
        letters: str = alphabet[
            alphabet.index(start_letter.upper()) : alphabet.index(stop_letter.upper())
            + 1
        ]

        for letter in letters:
            for number in range(start_number, stop_number + 1):
                rack: Rack = Rack(row_letter=letter, row_number=number)

                rack_table.add_rack(rack=rack)
    except KeyError:
        return HTTPStatus.BAD_REQUEST
    except DBWriteException:
        return HTTPStatus.INTERNAL_SERVER_ERROR

    return HTTPStatus.OK
