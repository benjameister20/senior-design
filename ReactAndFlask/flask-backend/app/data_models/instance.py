from typing import Optional

from app.main.types import JSON


class Instance:
    """
    A data model for an instance

    Attributes:
        model_id (int): id of a model
        hostname (str): host name
        rack_label (str): label of rack of instance
        rack_u (int): vertical position on rack
        owner (Optional[str]): username of owner
        comment (Optional[str]): comment
    """

    def __init__(
        self,
        model_id: int,
        hostname: str,
        rack_label: str,
        rack_u: int,
        owner: Optional[str],
        comment: Optional[str],
    ) -> None:
        self.model_id: int = model_id
        self.hostname: str = hostname
        self.rack_label: str = rack_label
        self.rack_u: int = rack_u
        self.owner: Optional[str] = owner
        self.comment: Optional[str] = comment

    def make_json(self) -> JSON:
        return {
            "model_id": self.model_id,
            "hostname": self.hostname,
            "rack_label": f"{self.rack_label}",
            "rack_u": self.rack_u,
            "owner": self.owner,
            "comment": self.comment,
        }

    def __repr__(self) -> str:
        return f"Instance {self.hostname} {self.rack_label}"
