from typing import Optional

from app.main.types import JSON


class Model:
    """
    A data model for a model

    Attributes:
        vendor (str)
        model_number (str)
        height (int)
        eth_ports (Optional[int])
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
        eth_ports: Optional[int],
        power_ports: Optional[int],
        cpu: Optional[str],
        memory: Optional[int],
        storage: Optional[str],
        comment: Optional[str],
        display_color: str = "000000",
    ) -> None:
        self.vendor: str = vendor
        self.model_number: str = model_number
        self.height: int = height
        self.eth_ports: Optional[int] = eth_ports
        self.power_ports: Optional[int] = power_ports
        self.cpu: Optional[str] = cpu
        self.memory: Optional[int] = memory
        self.storage: Optional[str] = storage
        self.comment: Optional[str] = comment
        self.display_color: str = display_color

    def make_json(self) -> JSON:
        return {
            "vendor": self.vendor,
            "model_number": self.model_number,
            "height": self.height,
            "eth_ports": self.eth_ports,
            "power_ports": self.power_ports,
            "cpu": self.cpu,
            "memory": self.memory,
            "storage": self.storage,
            "comment": self.comment,
            "display_color": self.display_color,
        }

    def __repr__(self) -> str:
        return "Model {self.vendor} {self.model_number}"
