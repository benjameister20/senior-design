import json
from typing import List

from app.main.types import JSON
from app.permissions.permissions_constants import PermissionConstants as pc


class Permission:
    """
    A data model for a set of Permissions

    Attributes:
        label (str): row letter and number
    """

    def __init__(
        self,
        model: bool,
        asset: bool,
        datacenters: List[str],
        power: bool,
        audit: bool,
        admin: bool,
    ) -> None:
        self.model = model
        self.asset = asset
        self.datacenters = datacenters
        self.power = power
        self.audit = audit
        self.admin = admin

    def make_json(self) -> JSON:
        return {
            pc.MODEL: self.model,
            pc.ASSET: self.asset,
            pc.DATACENTERS: self.datacenters,
            pc.POWER: self.power,
            pc.AUDIT: self.audit,
            pc.ADMIN: self.admin,
        }

    def __eq__(self, other) -> bool:
        return (
            self.model == other.model
            and self.asset == other.asset
            and self.power == other.power
            and self.audit == other.audit
            and self.admin == other.admin
            and set(self.datacenters) == set(other.datacenters)
        )

    def __repr__(self) -> str:
        return json.dumps(self.make_json(), indent=4)
