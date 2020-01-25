class Rack:
    """
    A data model for a Rack

    Attributes:
        row_letter (str): row letter
        row_number (int): row number
    """

    def __init__(self, row_letter: str, row_number: int) -> None:
        self.row_letter: str = row_letter
        self.row_number: int = row_number
