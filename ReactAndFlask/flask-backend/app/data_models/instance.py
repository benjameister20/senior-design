from typing import Any, Dict, List, Optional

from app.main.types import JSON


class Instance:
    """
    A data model for an instance

    Attributes:
        model_id (int): id of a model
        hostname (str): host name
        rack_label (str): label of rack of instance
        rack_position (int): vertical position on rack
        owner (Optional[str]): username of owner
        comment (Optional[str]): comment
    """

    def __init__(
        self,
        model_id: int,
        hostname: str,
        rack_label: str,
        rack_position: int,
        owner: Optional[str],
        comment: Optional[str],
    ) -> None:
        self.model_id: int = model_id
        self.hostname: str = hostname
        self.rack_label: str = rack_label
        self.rack_position: int = rack_position
        self.owner: Optional[str] = owner
        self.comment: Optional[str] = comment

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Instance):
            return NotImplemented
        return (
            str(self.model_id) == str(other.model_id)
            and self.hostname == other.hostname
            and self.rack_label == other.rack_label
            and str(self.rack_position) == str(other.rack_position)
            and self.owner == other.owner
            and self.comment == other.comment
        )

    @classmethod
    def headers(cls) -> List[str]:
        return [
            "hostname",
            "rack",
            "rack_position",
            "vendor",
            "model_number",
            "owner",
            "comment",
        ]

    def make_json(self) -> JSON:
        return {
            "model": self.model_id,
            "hostname": self.hostname,
            "rack": f"{self.rack_label}",
            "rack_position": self.rack_position,
            "owner": self.owner,
            "comment": self.comment,
        }

    def make_json_with_model_name(self, model_name):
        return {
            "model": model_name,
            "hostname": self.hostname,
            "rack": f"{self.rack_label}",
            "rack_position": self.rack_position,
            "owner": self.owner,
            "comment": self.comment,
        }

    @classmethod
    def from_csv(cls, csv_row: Dict[str, Any]) -> "Instance":
        for key in csv_row.keys():
            if csv_row[key] == "None":
                csv_row[key] = ""

        return Instance(
            model_id=csv_row["model_id"],
            hostname=csv_row["hostname"],
            rack_label=csv_row["rack"],
            rack_position=csv_row["rack_position"],
            owner=csv_row["owner"],
            comment=csv_row["comment"],
        )

    def _format_csv_entry(self, entry: str) -> str:
        if '"' not in entry and "\n" not in entry:
            return entry

        new_entry: str = ""
        for character in entry:
            if character == '"':
                new_entry += '""'
            else:
                new_entry += character

        return f'"{new_entry}"'

    def to_csv(self, vendor: str, model_number: str) -> str:
        """ Get the model as a csv row """
        json_data: JSON = self.make_json()
        json_data["vendor"] = vendor
        json_data["model_number"] = model_number

        values: List[str] = list(
            map(
                lambda x: self._format_csv_entry(entry=str(json_data[x])),
                Instance.headers(),
            )
        )
        clean_values: List[str] = list(map(lambda x: "" if x == "None" else x, values))

        return ",".join(clean_values)

    def __repr__(self) -> str:
        return f"Instance {self.hostname} {self.rack_label}"
