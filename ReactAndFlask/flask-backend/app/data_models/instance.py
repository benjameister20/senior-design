from typing import Any, Dict, List, Optional

from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.model_table import ModelTable
from app.data_models.model import Model
from app.main.types import JSON

DCTABLE = DatacenterTable()
MODELTABLE = ModelTable()


def _make_network_connections(model: Model):
    network_connections = {}
    ethernet_ports = model.ethernet_ports
    for port in ethernet_ports:
        network_connections[port] = {
            Constants.MAC_ADDRESS_KEY: "",
            Constants.CONNECTION_HOSTNAME: "",
            Constants.CONNECTION_PORT: "",
        }

    return network_connections


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
        hostname: Optional[str],
        rack_label: str,
        rack_position: int,
        owner: Optional[str],
        comment: Optional[str],
        datacenter_id: int,
        network_connections: Optional[Dict[str, Any]],
        power_connections: Optional[List[str]],
        asset_number: int,
    ) -> None:
        self.model_id: int = model_id
        self.hostname: Optional[str] = hostname
        self.rack_label: str = rack_label
        self.rack_position: int = rack_position
        self.owner: Optional[str] = owner
        self.comment: Optional[str] = comment
        self.datacenter_id: int = datacenter_id
        self.network_connections: Optional[Dict[str, Any]] = network_connections
        self.power_connections: Optional[List[str]] = power_connections
        self.asset_number: int = asset_number

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
            Constants.HOSTNAME_KEY,
            Constants.RACK_KEY,
            Constants.RACK_POSITION_KEY,
            Constants.VENDOR_KEY,
            Constants.MODEL_NUMBER_KEY,
            Constants.OWNER_KEY,
            Constants.COMMENT_KEY,
        ]

    def make_json(self) -> JSON:
        return {
            Constants.MODEL_KEY: self.model_id,
            Constants.HOSTNAME_KEY: self.hostname,
            Constants.RACK_KEY: f"{self.rack_label}",
            Constants.RACK_POSITION_KEY: self.rack_position,
            Constants.OWNER_KEY: self.owner,
            Constants.COMMENT_KEY: self.comment,
            Constants.DC_ID_KEY: self.datacenter_id,
            Constants.NETWORK_CONNECTIONS_KEY: self.network_connections,
            Constants.POWER_CONNECTIONS_KEY: self.power_connections,
            Constants.ASSET_NUMBER_KEY: self.asset_number,
        }

    def make_json_with_model_and_datacenter(self, model, datacenter):
        return {
            Constants.MODEL_KEY: f"{model.vendor} {model.model_number}",
            Constants.HEIGHT_KEY: f"{model.height}",
            Constants.HOSTNAME_KEY: self.hostname,
            Constants.RACK_KEY: f"{self.rack_label}",
            Constants.RACK_POSITION_KEY: self.rack_position,
            Constants.OWNER_KEY: self.owner,
            Constants.COMMENT_KEY: self.comment,
            Constants.DC_NAME_KEY: datacenter.name,
            Constants.DC_ABRV_KEY: datacenter.abbreviation,
            Constants.NETWORK_CONNECTIONS_KEY: self.network_connections,
            Constants.POWER_CONNECTIONS_KEY: self.power_connections,
            Constants.ASSET_NUMBER_KEY: self.asset_number,
        }

    @classmethod
    def from_csv(cls, csv_row: Dict[str, Any]) -> "Instance":
        for key in csv_row.keys():
            if csv_row[key] == "None":
                csv_row[key] = ""

        power_connections = [
            csv_row[Constants.CSV_POWER_PORT_1],
            csv_row[Constants.CSV_POWER_PORT_2],
        ]
        datacenter_id = DCTABLE.get_datacenter_id_by_name(
            csv_row[Constants.CSV_DC_NAME_KEY]
        )
        model_id = MODELTABLE.get_model_id_by_vendor_number(
            csv_row[Constants.VENDOR_KEY], csv_row[Constants.MODEL_NUMBER_KEY]
        )
        model: Model = MODELTABLE.get_model(model_id)
        network_connections = _make_network_connections(model)

        # if csv_row[Constants.ASSET_NUMBER_KEY] == "":

        return Instance(
            model_id=model_id,
            hostname=csv_row[Constants.HOSTNAME_KEY],
            rack_label=csv_row[Constants.RACK_KEY],
            rack_position=csv_row[Constants.RACK_POSITION_KEY],
            owner=csv_row[Constants.OWNER_KEY],
            comment=csv_row[Constants.COMMENT_KEY],
            datacenter_id=datacenter_id,
            network_connections=network_connections,
            power_connections=power_connections,
            asset_number=csv_row[Constants.ASSET_NUMBER_KEY],
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
        json_data[Constants.VENDOR_KEY] = vendor
        json_data[Constants.MODEL_NUMBER_KEY] = model_number

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
