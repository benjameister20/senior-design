from http import HTTPStatus
from typing import Any, Dict, Tuple, Union

JSON = Dict[str, Any]
JSONResponse = Union[HTTPStatus, JSON, Tuple[JSON, HTTPStatus]]
