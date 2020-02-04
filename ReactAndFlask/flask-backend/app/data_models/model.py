from typing import Any, Dict, List, Optional

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
        ethernet_ports: Optional[int] = None,
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
        self.ethernet_ports: Optional[int] = ethernet_ports
        self.power_ports: Optional[int] = power_ports
        self.cpu: Optional[str] = cpu
        self.memory: Optional[int] = memory
        self.storage: Optional[str] = storage
        self.comment: Optional[str] = comment

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
        return Model(
            vendor=csv_row["vendor"],
            model_number=csv_row["model_number"],
            height=csv_row["height"],
            display_color=csv_row["display_color"],
            ethernet_ports=csv_row["ethernet_ports"],
            power_ports=csv_row["power_ports"],
            cpu=csv_row["cpu"],
            memory=csv_row["memory"],
            storage=csv_row["storage"],
            comment=csv_row["comment"],
        )

    def to_csv(self) -> str:
        """ Get the model as a csv row """
        json_data: JSON = self.make_json()
        values: List[str] = list(map(lambda x: str(json_data[x]), Model.headers()))

        return ",".join(values)

    def __repr__(self) -> str:
        return "Model {self.vendor} {self.model_number}"
