from typing import Any, Dict, List, Optional

from app.constants import Constants
from app.main.types import JSON


class Decommission:
    """
    A data model for an instance that has been decommissioned

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
        vendor: str,
        model_number: str,
        height: int,
        hostname: Optional[str],
        rack_label: str,
        rack_position: int,
        owner: Optional[str],
        comment: Optional[str],
        datacenter_name: str,
        network_connections: Optional[Dict[str, Any]],
        power_connections: Optional[List[str]],
        asset_number: int,
        timestamp: str,
        decommission_user: str,
        network_neighborhood: Optional[Dict[str, Any]],
    ) -> None:
        self.vendor: str = vendor
        self.model_number: str = model_number
        self.height: int = height
        self.hostname: Optional[str] = hostname
        self.rack_label: str = rack_label
        self.rack_position: int = rack_position
        self.owner: Optional[str] = owner
        self.comment: Optional[str] = comment
        self.datacenter_name: str = datacenter_name
        self.network_connections: Optional[Dict[str, Any]] = network_connections
        self.power_connections: Optional[List[str]] = power_connections
        self.asset_number: int = asset_number

        self.timestamp: str = timestamp
        self.decommission_user: str = decommission_user
        self.network_neighborhood: Optional[Dict[str, Any]] = network_neighborhood

    def make_json(self) -> JSON:
        return {
            Constants.VENDOR_KEY: self.vendor,
            Constants.MODEL_NUMBER_KEY: self.model_number,
            Constants.HEIGHT_KEY: self.height,
            Constants.HOSTNAME_KEY: self.hostname,
            Constants.RACK_KEY: f"{self.rack_label}",
            Constants.RACK_POSITION_KEY: self.rack_position,
            Constants.OWNER_KEY: self.owner,
            Constants.COMMENT_KEY: self.comment,
            Constants.DC_NAME_KEY: self.datacenter_name,
            Constants.NETWORK_CONNECTIONS_KEY: self.network_connections,
            Constants.POWER_CONNECTIONS_KEY: self.power_connections,
            Constants.ASSET_NUMBER_KEY: self.asset_number,
            Constants.TIMESTAMP_KEY: self.timestamp,
            Constants.DECOM_USER_KEY: self.decommission_user,
            Constants.NETWORK_NEIGHBORHOOD_KEY: self.network_neighborhood,
        }
