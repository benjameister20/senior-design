from app.main.types import JSON


class Rack:
    """
    A data model for a Rack

    Attributes:
        label (str): row letter and number
    """

    def __init__(self, label: str, datacenter_id: int) -> None:
        self.label = label
        self.datacenter_id = datacenter_id

    def make_json(self) -> JSON:
        return {
            "label": self.label,
            "datacenter_id": self.datacenter_id,
        }

    def __repr__(self) -> str:
        return f"Rack {self.label}"
