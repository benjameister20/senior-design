from typing import List

from app.constants import Constants
from app.main.types import JSON


class Rack:
    """
    A data model for a Rack

    Attributes:
        label (str): row letter and number
    """

    def __init__(
        self, label: str, datacenter_id: int, pdu_left: List[int], pdu_right: List[int]
    ) -> None:
        self.label = label
        self.datacenter_id = datacenter_id
        self.pdu_left = pdu_left
        self.pdu_right = pdu_right

    def make_json(self) -> JSON:
        return {
            Constants.LABEL_KEY: self.label,
            Constants.DC_ID_KEY: self.datacenter_id,
            "pdu_left": self.pdu_left,
            "pdu_right": self.pdu_right,
        }

    def __repr__(self) -> str:
        return f"Rack {self.label}"
