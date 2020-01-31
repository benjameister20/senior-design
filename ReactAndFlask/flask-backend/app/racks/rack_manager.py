import string
from typing import Any, Callable, List

from app.dal.database import DBWriteException
from app.dal.instance_table import InstanceTable
from app.dal.rack_table import RackTable
from app.data_models.instance import Instance
from app.data_models.rack import Rack
from app.main.types import JSON


class InvalidRangeError(Exception):
    """ Raised when a rack range is invalid """


class RackNotEmptyError(Exception):
    """ Raised when a nonempty rack is being deleted """


def _add_rack_modifier(rack: Rack) -> None:
    """ Add a rack """
    RackTable().add_rack(rack=rack)


def _delete_rack_modifier(rack: Rack) -> None:
    """ Delete a rack """
    instances: List[Instance] = InstanceTable().find_instances_with_rack(
        rack_label=rack.label
    )
    if len(instances) != 0:
        raise RackNotEmptyError

    RackTable().delete_rack(rack=rack)


def _get_rack_modifier(rack: Rack) -> JSON:
    """ Get rack details """
    return {rack.label: InstanceTable().find_instances_with_rack(rack_label=rack.label)}


def _modify_rack_range(
    start_letter: str,
    stop_letter: str,
    start_number: int,
    stop_number: int,
    modifier: Callable[[Rack], Any],
) -> List[Any]:
    """ Modify a range of racks """
    if (not start_letter.isalpha) or (not stop_letter.isalpha):
        raise InvalidRangeError

    if start_number < 1 or start_number > stop_number:
        raise InvalidRangeError

    alphabet: str = string.ascii_uppercase
    letters: str = alphabet[
        alphabet.index(start_letter.upper()) : alphabet.index(stop_letter.upper()) + 1
    ]

    results: List[Any] = []
    try:
        for letter in letters:
            for number in range(start_number, stop_number + 1):
                rack: Rack = Rack(label=f"{letter}{number}")
                results.append(modifier(rack))
    except (DBWriteException, RackNotEmptyError):
        raise

    return results


def get_rack_range(
    start_letter: str, stop_letter: str, start_number: int, stop_number: int,
) -> List[JSON]:
    """ Get details of a range of racks """
    return _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_get_rack_modifier,
    )


def add_rack_range(
    start_letter: str, stop_letter: str, start_number: int, stop_number: int,
) -> None:
    """ Add a range of racks """
    _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_add_rack_modifier,
    )


def delete_rack_range(
    start_letter: str, stop_letter: str, start_number: int, stop_number: int,
) -> None:
    """ Delete a range of racks """
    _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_delete_rack_modifier,
    )