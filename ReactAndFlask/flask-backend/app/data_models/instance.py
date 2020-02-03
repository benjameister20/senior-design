from typing import Any, Dict, List, Optional

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

    @classmethod
    def headers(cls) -> List[str]:
        return [
            "model_id",
            "hostname",
            "rack_label",
            "rack_u",
            "owner",
            "comment",
        ]

    def make_json(self) -> JSON:
        return {
            "model": self.model_id,
            "hostname": self.hostname,
            "rack": f"{self.rack_label}",
            "rack_u": self.rack_u,
            "owner": self.owner,
            "comment": self.comment,
        }

    def make_json_with_model_name(self, model_name):
        return {
            "model": model_name,
            "hostname": self.hostname,
            "rack": f"{self.rack_label}",
            "rack_u": self.rack_u,
            "owner": self.owner,
            "comment": self.comment,
        }

    @classmethod
    def from_csv(cls, csv_row: Dict[str, Any]) -> "Instance":
        return Instance(
            model_id=csv_row["model_id"],
            hostname=csv_row["hostname"],
            rack_label=csv_row["rack"],
            rack_u=csv_row["rack_position"],
            owner=csv_row["owner"],
            comment=csv_row["comment"],
        )

    def to_csv(self) -> str:
        """ Get the model as a csv row """
        json_data: JSON = self.make_json()
        values: List[str] = list(map(lambda x: str(json_data[x]), Instance.headers()))

        return ",".join(values)

    def __repr__(self) -> str:
        return f"Instance {self.hostname} {self.rack_label}"
