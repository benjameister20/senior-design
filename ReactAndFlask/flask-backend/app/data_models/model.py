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
        mount_type: str,
        height: Optional[int] = None,
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
        self.mount_type: str = mount_type
        self.height: Optional[int] = height
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
            Constants.MOUNT_TYPE_KEY,
            Constants.VENDOR_KEY,
            Constants.MODEL_NUMBER_KEY,
            Constants.HEIGHT_KEY,
            Constants.DISPLAY_COLOR_KEY,
            Constants.CSV_ETHERNET_PORT_KEY,
            Constants.POWER_PORT_KEY,
            Constants.CPU_KEY,
            Constants.MEMORY_KEY,
            Constants.STORAGE_KEY,
            Constants.COMMENT_KEY,
            Constants.CSV_NETWORK_PORT_1,
            Constants.CSV_NETWORK_PORT_2,
            Constants.CSV_NETWORK_PORT_3,
            Constants.CSV_NETWORK_PORT_4,
        ]

    def make_json(self) -> JSON:
        return {
            Constants.VENDOR_KEY: self.vendor,
            Constants.MODEL_NUMBER_KEY: self.model_number,
            Constants.HEIGHT_KEY: self.height,
            Constants.DISPLAY_COLOR_KEY: self.display_color,
            Constants.ETHERNET_PORT_KEY: self.ethernet_ports,
            Constants.POWER_PORT_KEY: self.power_ports,
            Constants.CPU_KEY: self.cpu,
            Constants.MEMORY_KEY: self.memory,
            Constants.STORAGE_KEY: self.storage,
            Constants.COMMENT_KEY: self.comment,
            Constants.MOUNT_TYPE_KEY: self.mount_type,
        }

    @classmethod
    def from_csv(cls, csv_row: Dict[str, Any]) -> "Model":
        for key in csv_row.keys():
            if csv_row[key] == "None":
                csv_row[key] = ""

        # FIX ETHERNET PORT IMPORT
        if csv_row[Constants.CSV_ETHERNET_PORT_KEY] == "":
            network_port_num = 0
        else:
            network_port_num = int(csv_row[Constants.CSV_ETHERNET_PORT_KEY])
        port_names = [
            csv_row.get(Constants.CSV_NETWORK_PORT_1),
            csv_row.get(Constants.CSV_NETWORK_PORT_2),
            csv_row.get(Constants.CSV_NETWORK_PORT_3),
            csv_row.get(Constants.CSV_NETWORK_PORT_4),
        ]

        network_ports = []
        count = 1
        for port in port_names:
            if count <= network_port_num:
                if port is not None and port != "":
                    network_ports.append(port)
                else:
                    network_ports.append(str(count))

                count += 1

        while len(network_ports) < network_port_num:
            network_ports.append(str(count))
            count += 1

        mount_type = (
            csv_row[Constants.MOUNT_TYPE_KEY]
            if csv_row[Constants.MOUNT_TYPE_KEY] != "asset"
            else "rackmount"
        )

        return Model(
            vendor=csv_row[Constants.VENDOR_KEY],
            model_number=csv_row[Constants.MODEL_NUMBER_KEY],
            mount_type=mount_type,
            height=csv_row[Constants.HEIGHT_KEY],
            display_color=csv_row[Constants.DISPLAY_COLOR_KEY],
            ethernet_ports=network_ports,
            power_ports=csv_row[Constants.POWER_PORT_KEY]
            if csv_row[Constants.POWER_PORT_KEY] != ""
            else None,
            cpu=csv_row[Constants.CPU_KEY],
            memory=csv_row[Constants.MEMORY_KEY]
            if csv_row[Constants.MEMORY_KEY] != ""
            else None,
            storage=csv_row[Constants.STORAGE_KEY],
            comment=csv_row[Constants.COMMENT_KEY],
        )

    @classmethod
    def from_json(cls, json: JSON) -> "Model":
        vendor: str = json[Constants.VENDOR_KEY]
        model_number: str = json[Constants.MODEL_NUMBER_KEY]

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")

        mount_type: str = json[Constants.MOUNT_TYPE_KEY]
        if mount_type == Constants.BLADE_KEY:
            height = 1
        else:
            height = int(json[Constants.HEIGHT_KEY])
            if height == "":
                raise InvalidInputsError("Must provide a height")

        display_color: Optional[str] = json.get(Constants.DISPLAY_COLOR_KEY, None)
        display_color = None if display_color == "" else display_color

        ethernet_str: Optional[List[str]] = json.get(Constants.ETHERNET_PORT_KEY, None)
        ethernet_ports = []
        if mount_type != Constants.BLADE_KEY:
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
            mount_type=mount_type,
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

        print(json_data)

        # JANK CITY FIX WHEN TIME
        key_array = []
        key_array.append(Constants.CSV_NETWORK_PORT_1)
        key_array.append(Constants.CSV_NETWORK_PORT_2)
        key_array.append(Constants.CSV_NETWORK_PORT_3)
        key_array.append(Constants.CSV_NETWORK_PORT_4)

        net_ports = json_data.get(Constants.ETHERNET_PORT_KEY)
        if net_ports is not None:
            json_data[Constants.CSV_ETHERNET_PORT_KEY] = len(net_ports)
        else:
            json_data[Constants.CSV_ETHERNET_PORT_KEY] = ""

        if net_ports is not None:
            net_port_num = len(net_ports)
            count = 0
            for i in range(0, net_port_num):
                if count >= 4:
                    break
                json_data[key_array[i]] = net_ports[i]
                count += 1

            while count < 4:
                json_data[key_array[count]] = ""
                count += 1
        else:
            count = 0
            while count < 4:
                json_data[key_array[count]] = ""
                count += 1

        values: List[str] = list(
            map(
                lambda x: self._format_csv_entry(entry=str(json_data[x])),
                Model.headers(),
            )
        )
        clean_values: List[str] = list(map(lambda x: "" if x == "None" else x, values))

        return ",".join(clean_values)

    def __repr__(self) -> str:
        return f"Model {self.vendor} {self.model_number}"
