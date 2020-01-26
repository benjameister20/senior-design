from typing import Optional

from app.data_models.rack import Rack
from app.data_models.user import User


class Instance:
    """
    A data model for an instance

    Attributes:
        model (Model): a reference to a model
        hostname (str)
        rack (Rack)
        rack_u (int)
        owner (Optional[User])
        comment (Optional[str])
    """

    def __init__(
        self,
        model_id: int,
        hostname: str,
        rack: Rack,
        rack_u: int,
        owner: Optional[User],
        comment: Optional[str],
    ) -> None:
        self.model: int = model_id
        self.hostname: str = hostname
        self.rack: Rack = rack
        self.rack_u: int = rack_u
        self.owner: Optional[User] = owner
        self.comment: Optional[str] = comment
