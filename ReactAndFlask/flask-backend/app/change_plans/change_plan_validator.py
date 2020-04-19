import re

from app.constants import Constants
from app.dal.change_plan_action_table import ChangePlanActionTable
from app.dal.change_plan_table import ChangePlanTable
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.dal.user_table import UserTable
from app.instances.instance_manager import InstanceManager


class ChangePlanValidator:
    def __init__(self):
        self.instance_table = InstanceTable()
        self.model_table = ModelTable()
        self.rack_table = RackTable()
        self.user_table = UserTable()
        self.dc_table = DatacenterTable()
        self.cp_table = ChangePlanTable()
        self.cp_action_table = ChangePlanActionTable()
        self.instance_manager = InstanceManager()
        self.rack_height = 42

        self.cp_asset_set = set()
        self.decom_asset_set = set()
        self.no_pow_conflict = False

    def validate_action(self, cp_action, all_cp_actions):
        self.cp_asset_set = set()
        self.decom_asset_set = set()
        self.no_pow_conflict = False
        cp_validation_result = self._validate_change_plan(cp_action.change_plan_id)
        if cp_validation_result != Constants.API_SUCCESS:
            return cp_validation_result

        if cp_action.action == Constants.CREATE_KEY:
            return self._create_action_validate(cp_action, all_cp_actions)
        elif cp_action.action == Constants.UPDATE_KEY:
            return self._edit_action_validate(cp_action, all_cp_actions)
        elif cp_action.action == Constants.DECOMMISSION_KEY:
            return self._decom_action_validate(cp_action, all_cp_actions)
        else:
            return Constants.API_SUCCESS

    def _validate_change_plan(self, cp_id: int):
        change_plan = self.cp_table.get_change_plan(cp_id)
        if change_plan is None:
            return "Change plan actions must correspond to an existing change plan."

        if change_plan.executed:
            return "Cannot modify a change plan that has already been executed"

        return Constants.API_SUCCESS

    def _create_action_validate(self, cp_action, all_cp_actions):
        instance = self.instance_manager.make_instance(cp_action.new_record)
        datacenter = self.dc_table.get_datacenter(instance.datacenter_id)
        if datacenter is None:
            return "The datacenter does not exist. Please select a valid datacenter."

        input_validation_result = self._validate_inputs(instance, datacenter)
        if input_validation_result != Constants.API_SUCCESS:
            return input_validation_result

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        if (instance.mount_type != Constants.BLADE_KEY) and (
            not datacenter.is_offline_storage
        ):
            instance_bottom = int(instance.rack_position)
            instance_top = instance_bottom + int(model_template.height) - 1

            if instance_top > self.rack_height:
                return "The placement of the instance exceeds the height of the rack."
        else:
            instance_bottom = 0
            instance_top = 0

        new_asset_number = instance.asset_number
        new_hostname = instance.hostname
        pow_connections = set(instance.power_connections)

        prev_action_val_result = self._validate_vs_prev_actions(
            instance,
            all_cp_actions,
            cp_action,
            new_asset_number,
            new_hostname,
            pow_connections,
            instance_bottom,
            instance_top,
            datacenter,
        )
        if prev_action_val_result != Constants.API_SUCCESS:
            return prev_action_val_result

        common_val_result = self._common_validations(
            instance, cp_action, instance_bottom, instance_top, datacenter
        )
        if common_val_result != Constants.API_SUCCESS:
            return common_val_result

        if (not datacenter.is_offline_storage) and (
            instance.mount_type != Constants.BLADE_KEY
        ):
            if not self.no_pow_conflict:
                rack = self.rack_table.get_rack(
                    instance.rack_label, instance.datacenter_id
                )
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

            connection_validation_result = self._validate_connections(
                instance.network_connections,
                instance.hostname,
                cp_action,
                all_cp_actions,
            )
            if connection_validation_result != Constants.API_SUCCESS:
                return connection_validation_result

        return Constants.API_SUCCESS

    def _edit_action_validate(self, cp_action, all_cp_actions):
        instance = self.instance_manager.make_instance(cp_action.new_record)
        datacenter = self.dc_table.get_datacenter(instance.datacenter_id)
        if datacenter is None:
            return "The datacenter does not exist. Please select a valid datacenter."

        input_validation_result = self._validate_inputs(instance, datacenter)
        if input_validation_result != Constants.API_SUCCESS:
            return input_validation_result

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        if (instance.mount_type != Constants.BLADE_KEY) and (
            not datacenter.is_offline_storage
        ):
            instance_bottom = int(instance.rack_position)
            instance_top = instance_bottom + int(model_template.height) - 1

            if instance_top > self.rack_height:
                return "The placement of the instance exceeds the height of the rack."
        else:
            instance_bottom = 0
            instance_top = 0

        prev_update_in_plan = self.cp_action_table.get_newest_asset_record_in_plan(
            cp_action.change_plan_id, cp_action.original_asset_number, 999999999,
        )
        if (
            prev_update_in_plan is not None
            and prev_update_in_plan.action != Constants.COLLATERAL_KEY
            and prev_update_in_plan.step != cp_action.step
        ):
            return f"This asset is already being modified in step {prev_update_in_plan.step}. Please update your desired information there."

        new_asset_number = instance.asset_number
        new_hostname = instance.hostname
        pow_connections = set(instance.power_connections)

        prev_action_val_result = self._validate_vs_prev_actions(
            instance,
            all_cp_actions,
            cp_action,
            new_asset_number,
            new_hostname,
            pow_connections,
            instance_bottom,
            instance_top,
            datacenter,
        )
        if prev_action_val_result != Constants.API_SUCCESS:
            return prev_action_val_result

        common_val_result = self._common_validations(
            instance, cp_action, instance_bottom, instance_top, datacenter
        )
        if common_val_result != Constants.API_SUCCESS:
            return common_val_result

        if (not datacenter.is_offline_storage) and (
            instance.mount_type != Constants.BLADE_KEY
        ):
            if prev_update_in_plan is not None:
                prev_connections = prev_update_in_plan.new_record.get(
                    Constants.NETWORK_CONNECTIONS_KEY
                )
            else:
                prev_instance = self.instance_table.get_instance_by_asset_number(
                    cp_action.original_asset_number
                )
                prev_connections = prev_instance.network_connections

            connection_validation_result = self._validate_connections_edit(
                instance.network_connections,
                instance.hostname,
                cp_action,
                all_cp_actions,
                prev_connections,
            )
            if connection_validation_result != Constants.API_SUCCESS:
                return connection_validation_result

        return Constants.API_SUCCESS

    def _decom_action_validate(self, cp_action, all_cp_actions):
        asset = self.instance_table.get_instance_by_asset_number(
            cp_action.original_asset_number
        )
        if asset is None:
            return f"Asset with asset number {cp_action.original_asset_number} does not exist."

        prev_update_in_plan = self.cp_action_table.get_newest_asset_record_in_plan(
            cp_action.change_plan_id, cp_action.original_asset_number, 999999999,
        )
        if (
            prev_update_in_plan is not None
            and prev_update_in_plan.action != Constants.COLLATERAL_KEY
            and prev_update_in_plan.step != cp_action.step
        ):
            return f"This asset is already being modified in step {prev_update_in_plan.step}. Please update your desired information there."

        if asset.mount_type == Constants.CHASIS_KEY:
            no_conflict = set()
            for a in all_cp_actions:
                if a.new_record.get(Constants.CHASSIS_HOSTNAME_KEY) == asset.hostname:
                    return f"A blade chassis must be empty before it can be decommissioned. A blade is placed in the chassis in step {a.step} of the change plan."
                else:
                    no_conflict.add(a.original_asset_number)

            blade_list = self.instance_table.get_blades_by_chassis_hostname(
                asset.hostname
            )
            if blade_list is not None:
                for blade in blade_list:
                    if not blade.asset_number in no_conflict:
                        return f"A blade chassis must be empty before it can be decommissioned. Blade with asset number {blade.asset_number} is in the chassis."

        return Constants.API_SUCCESS

    def _validate_inputs(self, instance, datacenter):
        if (not datacenter.is_offline_storage) and (
            instance.mount_type != Constants.BLADE_KEY
        ):
            rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
            if rack is None:
                return f"Rack {instance.rack_label} does not exist in datacenter {datacenter.name}. Assets must be created on preexisting racks"

            rack_u_pattern = re.compile("[0-9]+")
            if rack_u_pattern.fullmatch(str(instance.rack_position)) is None:
                return "The value for Rack U must be a positive integer."

        asset_pattern = re.compile("[0-9]{6}")
        if asset_pattern.fullmatch(str(instance.asset_number)) is None:
            return "Asset numbers must be 6 digits long and only contain numbers."

        if instance.hostname is not None and instance.hostname != "":
            if len(instance.hostname) > 64:
                return "Hostnames must be 64 characters or less"

            host_pattern = re.compile("[a-zA-Z]*[A-Za-z0-9-]*[A-Za-z0-9]")
            if host_pattern.fullmatch(instance.hostname) is None:
                return "Hostnames must start with a letter, only contain letters, numbers, periods, and hyphens, and end with a letter or number."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return f"The owner {instance.owner} is not an existing user. Please enter the username of an existing user."

        return Constants.API_SUCCESS

    def _validate_vs_prev_actions(
        self,
        instance,
        all_cp_actions,
        cp_action,
        new_asset_number,
        new_hostname,
        pow_connections,
        instance_bottom: int,
        instance_top: int,
        datacenter,
    ):
        for prev_action in all_cp_actions:
            if prev_action.step >= cp_action.step:
                continue

            if prev_action.action != Constants.CREATE_KEY:
                self.cp_asset_set.add(prev_action.original_asset_number)
            if prev_action.action == Constants.DECOMMISSION_KEY:
                self.decom_asset_set.add(prev_action.original_asset_number)

            # Asset Number Validation
            if (
                prev_action.original_asset_number == new_asset_number
                and prev_action.action != Constants.DECOMMISSION_KEY
            ):
                return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."

            if (
                prev_action.new_record.get(Constants.ASSET_NUMBER_KEY)
                == new_asset_number
                and prev_action.action == Constants.CREATE_KEY
            ):
                return f"Asset with asset number {new_asset_number} is already being created in step {prev_action.step} of the change plan."

            # Hostname Validation
            if new_hostname is not None and new_hostname != "":
                if (
                    prev_action.new_record.get(Constants.HOSTNAME_KEY) == new_hostname
                    and prev_action.action != Constants.DECOMMISSION_KEY
                ):
                    return f"Asset with hostname {new_hostname} already exists in step {prev_action.step} of the change plan."

            # Location Validation
            if not datacenter.is_offline_storage:
                if instance.mount_type != Constants.BLADE_KEY:
                    if (
                        prev_action.action == Constants.CREATE_KEY
                        or prev_action.action == Constants.UPDATE_KEY
                    ):
                        model_id = self.instance_manager.get_model_id_from_name(
                            prev_action.new_record.get(Constants.MODEL_KEY)
                        )
                        model = self.model_table.get_model(model_id)
                        other_bottom = int(
                            prev_action.new_record.get(Constants.RACK_POSITION_KEY)
                        )
                        other_top = (
                            int(prev_action.new_record.get(Constants.RACK_POSITION_KEY))
                            + model.height
                            - 1
                        )
                        if (
                            other_bottom >= instance_bottom
                            and other_bottom <= instance_top
                        ):
                            result = f"The asset placement conflicts with asset with asset number {prev_action.new_record.get(Constants.ASSET_NUMBER_KEY)} "
                            result += f"edited in step {prev_action.step}."
                            return result
                        elif other_top >= instance_bottom and other_top <= instance_top:
                            result = f"The asset placement conflicts with asset with asset number {prev_action.new_record.get(Constants.ASSET_NUMBER_KEY)} "
                            result += f"edited in step {prev_action.step}."
                            return result
                elif (
                    instance.mount_type == Constants.BLADE_KEY
                    and prev_action.new_record.get(Constants.MOUNT_TYPE_KEY)
                    == Constants.BLADE_KEY
                ):
                    if instance.chassis_hostname == prev_action.new_record.get(
                        Constants.CHASSIS_HOSTNAME_KEY
                    ) and instance.chassis_slot == prev_action.new_record.get(
                        Constants.CHASSIS_SLOT_KEY
                    ):
                        return f"A blade is already being placed in chassis with hostname {instance.chassis_hostname} at position {instance.chassis_slot} in step {prev_action.step} of the change plan."

            # Power Connection Validation
            if (not datacenter.is_offline_storage) and (
                instance.mount_type != Constants.BLADE_KEY
            ):
                if (
                    prev_action.action != Constants.DECOMMISSION_KEY
                    and prev_action.action != Constants.COLLATERAL_KEY
                ):
                    prev_pow_connections = prev_action.new_record.get(
                        Constants.POWER_CONNECTIONS_KEY
                    )
                    print(prev_action.new_record)
                    prev_pow_connections = set(prev_pow_connections)
                    pow_intersection = pow_connections.intersection(
                        prev_pow_connections
                    )
                    if len(pow_intersection) > 0:
                        return f"There is already an asset connected at PDU port {pow_intersection.pop()}. Please pick an empty PDU port."

                if (
                    prev_action.action == Constants.UPDATE_KEY
                    or prev_action.action == Constants.DECOMMISSION_KEY
                ):
                    old_pow_connections = prev_action.old_record.get(
                        Constants.POWER_CONNECTIONS_KEY
                    )
                    if old_pow_connections is None:
                        self.no_pow_conflict = True
                    else:
                        old_pow_connections = set(old_pow_connections)
                        old_pow_intersection = pow_connections.intersection(
                            old_pow_connections
                        )
                        if len(old_pow_intersection) > 0:
                            self.no_pow_conflict = True

        return Constants.API_SUCCESS

    def _common_validations(
        self, instance, cp_action, instance_bottom, instance_top, datacenter
    ):
        if (
            self.instance_table.get_instance_by_asset_number(instance.asset_number)
            is not None
            and not instance.asset_number in self.decom_asset_set
            and instance.asset_number != cp_action.original_asset_number
        ):
            return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."

        if instance.hostname != "" and instance.hostname is not None:
            duplicate_hostname = self.instance_table.get_instance_by_hostname(
                instance.hostname
            )

            if (
                duplicate_hostname is not None
                and not duplicate_hostname.asset_number in self.cp_asset_set
                and duplicate_hostname.asset_number != instance.asset_number
            ):
                return f"An asset with hostname {duplicate_hostname.hostname} exists at location {duplicate_hostname.rack_label} U{duplicate_hostname.rack_position}"

        if not datacenter.is_offline_storage:
            if instance.mount_type != Constants.BLADE_KEY:
                instance_list = self.instance_table.get_instances_by_rack(
                    instance.rack_label, instance.datacenter_id
                )
                if instance_list is not None:
                    for current_instance in instance_list:
                        if (
                            current_instance.asset_number in self.cp_asset_set
                            or current_instance.asset_number
                            == cp_action.original_asset_number
                        ):
                            continue

                        model = self.model_table.get_model(instance.model_id)
                        current_instance_top = (
                            current_instance.rack_position + model.height - 1
                        )
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
            elif instance.mount_type == Constants.BLADE_KEY:
                blade_conflict = self.instance_table.get_blade_by_chassis_and_slot(
                    instance.chassis_hostname, instance.chassis_slot
                )
                if (
                    blade_conflict is not None
                    and not blade_conflict.asset_number in self.cp_asset_set
                ):
                    return f"A blade with hostname {blade_conflict.hostname} is already located in position {instance.chassis_slot} of chassis with hostname {instance.chassis_hostname}."

        return Constants.API_SUCCESS

    def _validate_connections(
        self, network_connections, hostname, cp_action, all_cp_actions
    ):
        result = ""
        new_connections = {}
        for my_port in network_connections:
            mac_adress = network_connections[my_port][Constants.MAC_ADDRESS_KEY]
            connection_hostname = network_connections[my_port]["connection_hostname"]
            connection_port = network_connections[my_port]["connection_port"]

            if connection_hostname in new_connections.keys():
                if new_connections[connection_hostname] == connection_port:
                    result += "Cannot make two network connections to the same port."
            elif connection_hostname != "" and connection_port != "":
                new_connections[connection_hostname] = connection_port

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

            other_instance = None
            for prev_action in all_cp_actions:
                if prev_action.step >= cp_action.step:
                    continue

                if (
                    prev_action.new_record[Constants.HOSTNAME_KEY]
                    == connection_hostname
                ):
                    other_instance = self.instance_manager.make_instance(
                        prev_action.new_record
                    )
            if other_instance is None:
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
                    result += f"The port {connection_port} on asset with hostname {connection_hostname} is already connected to another asset."

        if result == "":
            return Constants.API_SUCCESS
        else:
            return result

    def _validate_connections_edit(
        self, network_connections, hostname, cp_action, all_cp_actions, prev_connections
    ):
        result = ""
        new_connections = {}
        for my_port in network_connections:
            mac_adress = network_connections[my_port][Constants.MAC_ADDRESS_KEY]
            connection_hostname = network_connections[my_port]["connection_hostname"]
            connection_port = network_connections[my_port]["connection_port"]

            if connection_hostname in new_connections.keys():
                if new_connections[connection_hostname] == connection_port:
                    result += "Cannot make two network connections to the same port."
            elif connection_hostname != "" and connection_port != "":
                new_connections[connection_hostname] = connection_port

            mac_pattern = re.compile(
                "[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}"
            )
            if mac_adress != "" and mac_pattern.fullmatch(mac_adress.lower()) is None:
                result += f"Invalid MAC address for port {my_port}. MAC addresses must be 6 byte, colon separated hexidecimal strings (i.e. a1:b2:c3:d4:e5:f6). \n"

            if (connection_hostname == "" or connection_hostname is None) and (
                connection_port == "" or connection_port is None
            ):
                continue

            if (
                connection_hostname == prev_connections[my_port]["connection_hostname"]
                and connection_port == prev_connections[my_port]["connection_port"]
            ):
                continue

            if not (connection_hostname != "" and connection_port != ""):
                result += "Connections require both a hostname and connection port."

            other_instance = None
            for prev_action in all_cp_actions:
                if prev_action.step >= cp_action.step:
                    continue

                if (
                    prev_action.new_record[Constants.HOSTNAME_KEY]
                    == connection_hostname
                ):
                    other_instance = self.instance_manager.make_instance(
                        prev_action.new_record
                    )
            if other_instance is None:
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
                    result += f"The port {connection_port} on asset with hostname {connection_hostname} is already connected to another asset."

        if result == "":
            return Constants.API_SUCCESS
        else:
            return result

    def return_conflict(self, current_instance):
        result = f"The asset placement conflicts with asset with asset number {current_instance.asset_number} "
        result += f"on rack {current_instance.rack_label} at height U{current_instance.rack_position}."
        return result
