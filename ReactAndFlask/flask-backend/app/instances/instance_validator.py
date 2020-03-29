import re

from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.dal.user_table import UserTable


class InstanceValidator:
    def __init__(self):
        self.instance_table = InstanceTable()
        self.model_table = ModelTable()
        self.rack_table = RackTable()
        self.user_table = UserTable()
        self.dc_table = DatacenterTable()
        self.rack_height = 42

    def create_instance_validation(self, instance):
        rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
        if rack is None:
            dbTable = self.dc_table.get_datacenter_name_by_id(instance.datacenter_id)
            return f"Rack {instance.rack_label} does not exist in datacenter {dbTable}. Instances must be created on preexisting racks"

        for p_connection in instance.power_connections:
            char1 = p_connection[0].upper()
            num = int(p_connection[1:])
            if char1 == "L":
                pdu_arr = rack.pdu_left
            elif char1 == "R":
                pdu_arr = rack.pdu_right
            else:
                return "Invalid power connection. Please specify left or right PDU."

            if pdu_arr[num - 1] == 1:
                return f"There is already an asset connected at PDU {char1}{num}. Please pick an empty PDU port."

        asset_pattern = re.compile("[0-9]{6}")
        if asset_pattern.fullmatch(str(instance.asset_number)) is None:
            return "Asset numbers must be 6 digits long and only contain numbers."
        if (
            self.instance_table.get_instance_by_asset_number(instance.asset_number)
            is not None
        ):
            return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."

        if instance.hostname != "" and instance.hostname is not None:
            duplicate_hostname = self.instance_table.get_instance_by_hostname(
                instance.hostname
            )

            if duplicate_hostname is not None:
                return f"An instance with hostname {duplicate_hostname.hostname} exists at location {duplicate_hostname.rack_label} U{duplicate_hostname.rack_position}"

            if len(instance.hostname) > 64:
                return "Hostnames must be 64 characters or less"

            host_pattern = re.compile("[a-zA-Z]*[A-Za-z0-9-]*[A-Za-z0-9]")
            if host_pattern.fullmatch(instance.hostname) is None:
                return "Hostnames must start with a letter, only contain letters, numbers, periods, and hyphens, and end with a letter or number."

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        print("passed model validation")

        pattern = re.compile("[0-9]+")
        if pattern.fullmatch(str(instance.rack_position)) is None:
            return "The value for Rack U must be a positive integer."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return f"The owner {instance.owner} is not an existing user. Please enter the username of an existing user."

        instance_bottom = int(instance.rack_position)
        instance_top = instance_bottom + int(model_template.height) - 1

        if instance_top > self.rack_height:
            return "The placement of the instance exceeds the height of the rack."

        instance_list = self.instance_table.get_instances_by_rack(
            instance.rack_label, instance.datacenter_id
        )
        if instance_list is not None:
            for current_instance in instance_list:
                model = self.model_table.get_model(instance.model_id)
                current_instance_top = current_instance.rack_position + model.height - 1
                if (
                    current_instance.rack_position >= instance_bottom
                    and current_instance.rack_position <= instance_top
                ):
                    return self.return_conflict(current_instance)
                elif (
                    current_instance_top >= instance_bottom
                    and current_instance_top <= instance_top
                ):
                    return self.return_conflict(current_instance)

        connection_validation_result = self.validate_connections(
            instance.network_connections, instance.hostname
        )
        if connection_validation_result != Constants.API_SUCCESS:
            return connection_validation_result

        return Constants.API_SUCCESS

    def edit_instance_validation(self, instance, original_asset_number):
        rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
        if rack is None:
            return "The requested rack does not exist. Instances must be created on preexisting racks"

        for p_connection in instance.power_connections:
            char1 = p_connection[0].upper()
            num = int(p_connection[1:])
            if char1 == "L":
                pdu_arr = rack.pdu_left
            elif char1 == "R":
                pdu_arr = rack.pdu_right
            else:
                return "Invalid power connection. Please specify left or right PDU."

            if pdu_arr[num - 1] == 1:
                return f"There is already an asset connected at PDU {char1}{num}. Please pick an empty PDU port."

        if instance.asset_number != original_asset_number:
            asset_pattern = re.compile("[0-9]{6}")
            if asset_pattern.fullmatch(str(instance.asset_number)) is None:
                return "Asset numbers must be 6 digits long and only contain numbers."

            if (
                self.instance_table.get_instance_by_asset_number(instance.asset_number)
                is not None
            ):
                return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."

        if instance.hostname != "" and instance.hostname is not None:
            duplicate_hostname = self.instance_table.get_instance_by_hostname(
                instance.hostname
            )

            if duplicate_hostname is not None:
                is_self = duplicate_hostname.asset_number == original_asset_number
                if not is_self:
                    return f"An instance with hostname {duplicate_hostname.hostname} exists at location {duplicate_hostname.rack_label} U{duplicate_hostname.rack_position}"

            if len(instance.hostname) > 64:
                return "Hostnames must be 64 characters or less"

            host_pattern = re.compile("[a-zA-Z]*[A-Za-z0-9-]*[A-Za-z0-9]")
            if host_pattern.fullmatch(instance.hostname) is None:
                return "Hostnames must start with a letter, only contain letters, numbers, and hyphens, and end with a letter or number."

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        pattern = re.compile("[0-9]+")
        if pattern.fullmatch(str(instance.rack_position)) is None:
            return "The value for Rack U must be a positive integer."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return "The owner must be an existing user on the system. Please enter the username of an existing user."

        instance_bottom = int(instance.rack_position)
        instance_top = instance_bottom + int(model_template.height) - 1

        if instance_top > self.rack_height:
            return "The placement of the instance exceeds the height of the rack."

        instance_list = self.instance_table.get_instances_by_rack(
            instance.rack_label, instance.datacenter_id
        )
        if instance_list is None:
            return Constants.API_SUCCESS

        for current_instance in instance_list:
            if current_instance.asset_number == original_asset_number:
                continue
            model = self.model_table.get_model(instance.model_id)
            current_instance_top = current_instance.rack_position + model.height - 1
            if (
                current_instance.rack_position >= instance_bottom
                and current_instance.rack_position <= instance_top
            ):
                return self.return_conflict(current_instance)
            elif (
                current_instance_top >= instance_bottom
                and current_instance_top <= instance_top
            ):
                return self.return_conflict(current_instance)

        connection_validation_result = self.validate_connections(
            instance.network_connections, instance.hostname
        )
        if connection_validation_result != Constants.API_SUCCESS:
            return connection_validation_result

        return Constants.API_SUCCESS

    def validate_connections(self, network_connections, hostname):
        print("validating connections")
        result = ""
        for my_port in network_connections:
            mac_adress = network_connections[my_port][Constants.MAC_ADDRESS_KEY]
            connection_hostname = network_connections[my_port]["connection_hostname"]
            connection_port = network_connections[my_port]["connection_port"]

            mac_pattern = re.compile(
                "[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}"
            )
            if mac_adress != "" and mac_pattern.fullmatch(mac_adress.lower()) is None:
                result += f"Invalid MAC address for port {my_port}. MAC addresses must be 6 byte, colon separated hexidecimal strings (i.e. a1:b2:c3:d4:e5:f6). \n"

            if (connection_hostname == "" or connection_hostname is None) and (
                connection_port == "" or connection_port is None
            ):
                continue

            if not (connection_hostname != "" and connection_port != ""):
                result += "Connections require both a hostname and connection port."

            other_instance = self.instance_table.get_instance_by_hostname(
                connection_hostname
            )
            if other_instance is None:
                result += f"The asset with hostname {connection_hostname} does not exist. Connections must be between assets with existing hostnames. \n"
                continue

            if connection_port in other_instance.network_connections:
                if (
                    other_instance.network_connections[connection_port][
                        "connection_port"
                    ]
                    != my_port
                ) and (
                    other_instance.network_connections[connection_port][
                        "connection_port"
                    ]
                    != ""
                ):
                    result += f"The port {connection_port} on asset with hostname {connection_hostname} is connected to another asset. \n"
                    continue
                if (
                    other_instance.network_connections[connection_port][
                        "connection_hostname"
                    ]
                    != hostname
                ) and (
                    other_instance.network_connections[connection_port][
                        "connection_hostname"
                    ]
                    != ""
                ):
                    result += f"The port {connection_port} on asset with hostname {connection_hostname} is already connected to another asset. \n"

        print("finished connection validation")
        if result == "":
            return Constants.API_SUCCESS
        else:
            return result

    def return_conflict(self, current_instance):
        result = f"The asset placement conflicts with asset with asset number {current_instance.asset_number} "
        result += f"on rack {current_instance.rack_label} at height U{current_instance.rack_position}."
        return result
