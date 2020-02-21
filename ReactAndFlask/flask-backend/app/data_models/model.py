from typing import Any, Dict, List, Optional

from app.constants import Constants
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.main.types import JSON


class Model:
    """
    A data model for a model

    Attributes:
        vendor (str)
        model_number (str)
        height (int)
        ethernet_ports (Optional[int])
        power_ports (Optional[int])
        cpu (Optional[str])
        memory (Optional[int])
        storage (Optional[str])
        comment (Optional[str])
        display_color (str)
    """

    def __init__(
        self,
        vendor: str,
        model_number: str,
        height: int,
        display_color: Optional[str] = None,
        ethernet_ports: Optional[List[str]] = None,
        power_ports: Optional[int] = None,
        cpu: Optional[str] = None,
        memory: Optional[int] = None,
        storage: Optional[str] = None,
        comment: Optional[str] = None,
    ) -> None:
        self.vendor: str = vendor
        self.model_number: str = model_number
        self.height: int = height
        self.display_color: Optional[str] = display_color
        self.ethernet_ports: Optional[List[str]] = ethernet_ports
        self.power_ports: Optional[int] = power_ports
        self.cpu: Optional[str] = cpu
        self.memory: Optional[int] = memory
        self.storage: Optional[str] = storage
        self.comment: Optional[str] = comment

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Model):
            return NotImplemented
        return (
            self.vendor == other.vendor
            and self.model_number == other.model_number
            and str(self.height) == str(other.height)
            and self.display_color == other.display_color
            and str(self.ethernet_ports) == str(other.ethernet_ports)
            and str(self.power_ports) == str(other.power_ports)
            and self.cpu == other.cpu
            and str(self.memory) == str(other.memory)
            and self.storage == other.storage
            and self.comment == other.comment
        )

    @classmethod
    def headers(cls) -> List[str]:
        return [
            "vendor",
            "model_number",
            "height",
            "display_color",
            "ethernet_ports",
            "power_ports",
            "cpu",
            "memory",
            "storage",
            "comment",
        ]

    def make_json(self) -> JSON:
        return {
            "vendor": self.vendor,
            "model_number": self.model_number,
            "height": self.height,
            "display_color": self.display_color,
            "ethernet_ports": self.ethernet_ports,
            "power_ports": self.power_ports,
            "cpu": self.cpu,
            "memory": self.memory,
            "storage": self.storage,
            "comment": self.comment,
        }

    @classmethod
    def from_csv(cls, csv_row: Dict[str, Any]) -> "Model":
        for key in csv_row.keys():
            if csv_row[key] == "None":
                csv_row[key] = ""

        return Model(
            vendor=csv_row["vendor"],
            model_number=csv_row["model_number"],
            height=csv_row["height"],
            display_color=csv_row["display_color"],
            ethernet_ports=csv_row["ethernet_ports"]
            if csv_row["ethernet_ports"] != ""
            else None,
            power_ports=csv_row["power_ports"]
            if csv_row["power_ports"] != ""
            else None,
            cpu=csv_row["cpu"],
            memory=csv_row["memory"] if csv_row["memory"] != "" else None,
            storage=csv_row["storage"],
            comment=csv_row["comment"],
        )

    @classmethod
    def from_json(cls, json: JSON) -> "Model":
        vendor: str = json[Constants.VENDOR_KEY]
        model_number: str = json[Constants.MODEL_NUMBER_KEY]
        height: int = int(json[Constants.HEIGHT_KEY])

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")
        if height == "":
            raise InvalidInputsError("Must provide a height")

        display_color: Optional[str] = json.get(Constants.DISPLAY_COLOR_KEY, None)
        display_color = None if display_color == "" else display_color

        ethernet_str: Optional[List[str]] = json.get(Constants.ETHERNET_PORT_KEY, None)
        ethernet_ports = []
        if ethernet_str is not None:
            for name in ethernet_str:
                ethernet_ports.append(name)

        power_str: Optional[str] = json.get(Constants.POWER_PORT_KEY, None)
        power_ports: Optional[
            int
        ] = None if power_str == "" or power_str is None else int(power_str)

        cpu: Optional[str] = json.get(Constants.CPU_KEY, None)
        cpu = None if cpu == "" else cpu

        memory_str: Optional[str] = json.get(Constants.MEMORY_KEY, None)
        memory: Optional[int] = None if memory_str == "" or memory_str is None else int(
            memory_str
        )

        storage: Optional[str] = json.get(Constants.STORAGE_KEY, None)
        storage = None if storage == "" else storage

        comment: Optional[str] = json.get(Constants.COMMENT_KEY, None)
        comment = None if comment == "" else comment

        return Model(
            vendor=vendor,
            model_number=model_number,
            height=height,
            display_color=display_color,
            ethernet_ports=ethernet_ports,
            power_ports=power_ports,
            cpu=cpu,
            memory=memory,
            storage=storage,
            comment=comment,
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

    def to_csv(self) -> str:
        """ Get the model as a csv row """
        json_data: JSON = self.make_json()
        values: List[str] = list(
            map(
                lambda x: self._format_csv_entry(entry=str(json_data[x])),
                Model.headers(),
            )
        )
        clean_values: List[str] = list(map(lambda x: "" if x == "None" else x, values))

        return ",".join(clean_values)

    def __repr__(self) -> str:
        return "Model {self.vendor} {self.model_number}"
