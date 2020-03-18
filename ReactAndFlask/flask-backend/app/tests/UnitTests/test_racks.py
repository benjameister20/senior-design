import pytest
from app.racks.rack_manager import InvalidRangeError, _modify_rack_range


def _modifier(label, identifier, name):
    pass


def test_modify_rack_range_invalid_start_letter() -> None:
    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="2",
            stop_letter="B",
            start_number=1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )

    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="$",
            stop_letter="B",
            start_number=1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )


def test_modify_rack_range_invalid_stop_letter() -> None:
    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter="-",
            start_number=1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )

    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter=".",
            start_number=1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )


def test_modify_rack_range_invalid_start_num() -> None:
    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter="B",
            start_number=-1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )

    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter="B",
            start_number=-1,
            stop_number=2,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )


def test_modify_rack_range_invalid_stop_num() -> None:
    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter="B",
            start_number=1,
            stop_number=0,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )

    with pytest.raises(InvalidRangeError):
        _modify_rack_range(
            start_letter="A",
            stop_letter="B",
            start_number=1,
            stop_number=-10,
            modifier=_modifier,
            datacenter_id=2,
            datacenter_name="DC1",
        )
