import string
from typing import Any, Callable, List, Optional

from app.constants import Constants
from app.dal.database import DBWriteException
from app.dal.instance_table import InstanceTable, RackDoesNotExistError
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.data_models.instance import Instance
from app.data_models.rack import Rack
from app.main.types import JSON


class InvalidRangeError(Exception):
    """ Raised when a rack range is invalid """


class RackNotEmptyError(Exception):
    """ Raised when a nonempty rack is being deleted """


def _add_rack_modifier(label: str, datacenter_id: int, datacenter_name: str) -> JSON:
    """ Add a rack """
    rack_db: Optional[Rack] = RackTable().get_rack(
        label=label, datacenter_id=datacenter_id
    )
    if rack_db is not None:
        return {Constants.MESSAGE_KEY: f"Rack {label} already exists!"}

    pdu_init = [0] * 24
    RackTable().add_rack(rack=Rack(label, datacenter_id, pdu_init, pdu_init))

    return {}


def _delete_rack_modifier(label: str, datacenter_id: int, datacenter_name: str) -> None:
    """ Delete a rack """
    instances: List[Instance] = InstanceTable().get_instances_by_rack(
        rack_label=label, datacenter_id=datacenter_id
    )
    if len(instances) != 0:
        raise RackNotEmptyError

    RackTable().delete_rack(label=label, datacenter_id=datacenter_id)


def _get_rack_modifier(label: str, datacenter_id: int, datacenter_name: str) -> JSON:
    """ Get rack details """
    # Make sure rack exists
    rack_entry: Optional[Rack] = RackTable().get_rack(
        label=label, datacenter_id=datacenter_id
    )
    if rack_entry is None:
        raise RackDoesNotExistError(rack_label=label)

    instance_entries = InstanceTable().get_instances_by_rack(
        rack_label=label, datacenter_id=datacenter_id
    )

    return {
        label: list(
            map(
                lambda x: x.make_json_with_model_and_datacenter(
                    _get_model_from_id(x.model_id), datacenter_name
                ),
                instance_entries,
            )
        ),
    }


def _get_model_from_id(model_id):
    model = ModelTable().get_model(model_id)
    if model is None:
        raise DBWriteException

    return model


def _modify_rack_range(
    start_letter: str,
    stop_letter: str,
    start_number: int,
    stop_number: int,
    modifier: Callable[[str, int, str], Any],
    datacenter_id: int,
    datacenter_name: str,
) -> List[Any]:
    """ Modify a range of racks """
    if (not start_letter.isalpha) or (not stop_letter.isalpha):
        raise InvalidRangeError

    if start_number < 1 or start_number > stop_number:
        raise InvalidRangeError

    if start_letter.upper() > stop_letter.upper():
        raise InvalidRangeError

    alphabet: str = string.ascii_uppercase
    letters: str = alphabet[
        alphabet.index(start_letter.upper()) : alphabet.index(stop_letter.upper()) + 1
    ]

    results: List[Any] = []
    try:
        for letter in letters:
            for number in range(start_number, stop_number + 1):
                label = f"{letter}{number}"
                results.append(modifier(label, datacenter_id, datacenter_name))
    except (
        DBWriteException,
        InvalidRangeError,
        RackNotEmptyError,
        RackDoesNotExistError,
    ):
        raise

    return results


def get_rack_range(
    start_letter: str,
    stop_letter: str,
    start_number: int,
    stop_number: int,
    datacenter_id: int,
    datacenter_name: str,
) -> List[JSON]:
    """ Get details of a range of racks """
    return _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_get_rack_modifier,
        datacenter_id=datacenter_id,
        datacenter_name=datacenter_name,
    )


def add_rack_range(
    start_letter: str,
    stop_letter: str,
    start_number: int,
    stop_number: int,
    datacenter_id: int,
    datacenter_name: str,
) -> None:
    """ Add a range of racks """
    messages: List[JSON] = _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_add_rack_modifier,
        datacenter_id=datacenter_id,
        datacenter_name=datacenter_name,
    )

    for message in messages:
        if "message" in message:
            raise DBWriteException(message=message["message"])


def delete_rack_range(
    start_letter: str,
    stop_letter: str,
    start_number: int,
    stop_number: int,
    datacenter_id: int,
    datacenter_name: str,
) -> None:
    """ Delete a range of racks """
    _modify_rack_range(
        start_letter=start_letter,
        stop_letter=stop_letter,
        start_number=start_number,
        stop_number=stop_number,
        modifier=_delete_rack_modifier,
        datacenter_id=datacenter_id,
        datacenter_name=datacenter_name,
    )
