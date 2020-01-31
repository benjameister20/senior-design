from app.main.types import JSON


class Rack:
    """
    A data model for a Rack

    Attributes:
        label (str): row letter and number
    """

    def __init__(self, label: str) -> None:
        self.label = label

    def make_json(self) -> JSON:
        return {"label": self.label}

    def __repr__(self) -> str:
        return f"Rack {self.label}"
