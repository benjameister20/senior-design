from typing import Optional

from app.constants import Constants
from app.main.types import JSON


class ChangePlan:
    """
    A data model for change plan

    Attributes:
        identifier (int): unique id for the datacenter
        owner (Str): the owner that created the change plan
        name (str): full name of datacenter
    """

    def __init__(
        self,
        owner: str,
        name: str,
        executed: bool,
        timestamp: Optional[str],
        identifier: Optional[int],
    ) -> None:
        self.owner: str = owner
        self.name: str = name
        self.executed = executed

        if timestamp is not None:
            self.timestamp = timestamp
        else:
            self.timestamp = ""

        if identifier is not None:
            self.identifier = identifier
        else:
            self.identifier = -1

    def make_json(self) -> JSON:
        return {
            Constants.OWNER_KEY: self.owner,
            Constants.NAME_KEY: self.name,
            Constants.EXECUTED_KEY: str(self.executed),
            Constants.TIMESTAMP_KEY: self.timestamp,
            Constants.IDENTIFIER_KEY: self.identifier,
        }
