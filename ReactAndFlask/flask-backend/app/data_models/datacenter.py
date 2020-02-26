from app.constants import Constants
from app.main.types import JSON


class Datacenter:
    """
    A data model for a datacenter

    Attributes:
        identifier (int): unique id for the datacenter
        abbreviation (Str): max 6 character abbreviation of datacenter name
        name (str): full name of datacenter
    """

    def __init__(self, abbreviation, name,) -> None:
        self.abbreviation: str = abbreviation
        self.name: str = name

    def make_json(self) -> JSON:
        return {
            Constants.DC_ABRV_KEY: self.abbreviation,
            "name": self.name,
        }
