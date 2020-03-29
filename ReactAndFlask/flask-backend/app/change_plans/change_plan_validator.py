import re

from app.constants import Constants
from app.dal.change_plan_action_table import (
    ChangePlanActionEntry,
    ChangePlanActionTable,
)
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

    def validate_action(self, cp_action):
        cp_validation_result = self._validate_change_plan(cp_action.change_plan_id)
        if cp_validation_result != Constants.API_SUCCESS:
            return cp_validation_result

        if cp_action.action == Constants.CREATE_KEY:
            return self._create_action_validate(cp_action)
        elif cp_action.action == Constants.UPDATE_KEY:
            return self._edit_action_validate(cp_action)
        elif cp_action.action == Constants.DECOMMISSION_KEY:
            return self._decom_action_validate(cp_action)
        else:
            return Constants.API_SUCCESS

    def _validate_change_plan(self, cp_id: int):
        change_plan = self.cp_table.get_change_plan(cp_id)
        if change_plan is None:
            return "Change plan actions must correspond to an existing change plan."

        if change_plan.executed:
            return "Cannot modify a change plan that has already been executed"

        return Constants.API_SUCCESS

    def _create_action_validate(self, cp_action):
        instance = self.instance_manager.make_instance(cp_action.new_record)
        input_validation_result = self._validate_inputs(instance)
        if input_validation_result != Constants.API_SUCCESS:
            return input_validation_result

        # prev_action_list = []
        # all_cp_action_entries: List[
        #     ChangePlanActionEntry
        # ] = self.cp_action_table._get_change_plan_actions_between_steps(
        #     cp_action.change_plan_id, 0, cp_action.step - 1
        # )
        # for entry in all_cp_action_entries:
        #     prev_action_list.append(entry.make_change_plan_action())

        # prev_change_plan_action: ChangePlanAction = self.cp_action_table.get_newest_asset_record_in_plan(
        #     cp_action.change_plan_id, instance.asset_number, cp_action.step
        # )
        # if prev_change_plan_action is None:
        #     if (
        #         self.instance_table.get_instance_by_asset_number(instance.asset_number)
        #         is not None
        #     ):
        #         return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."
        # else:
        #     if prev_change_plan_action.action != Constants.DECOMMISSION_KEY:
        #         return f"Asset numbers must be unique. An asset with asset number {instance.asset_number} already exists."

        # if instance.hostname != "" and instance.hostname is not None:
        #     hostname_instance = self.instance_table.get_instance_by_hostname(
        #         instance.hostname
        #     )

        #     if hostname_instance is not None:
        #         prev_hostname_action: ChangePlanAction = self.cp_action_table.get_newest_asset_record_in_plan(
        #             cp_action.change_plan_id,
        #             hostname_instance.asset_number,
        #             cp_action.step,
        #         )
        #         if prev_hostname_action is None:
        #             return f"An instance with hostname {hostname_instance.hostname} exists at location {hostname_instance.rack_label} U{hostname_instance.rack_position}"

        #     for prev_action in prev_action_list:
        #         h_name = prev_action.new_record.get(Constants.HOSTNAME_KEY)
        #         if h_name == instance.hostname:
        #             return f"An instance with hostname {h_name} exists, most recently edited in step {prev_action.step} of the change plan."

        # model_template = self.model_table.get_model(instance.model_id)
        # if model_template is None:
        #     return "The model does not exist."

        # instance_bottom = int(instance.rack_position)
        # instance_top = instance_bottom + int(model_template.height) - 1

        # if instance_top > self.rack_height:
        #     return "The placement of the instance exceeds the height of the rack."

        # instance_list = self.instance_table.get_instances_by_rack(
        #     instance.rack_label, instance.datacenter_id
        # )
        # if instance_list is not None:
        #     for current_instance in instance_list:
        #         model = self.model_table.get_model(instance.model_id)
        #         current_instance_top = current_instance.rack_position + model.height - 1
        #         if (
        #             current_instance.rack_position >= instance_bottom
        #             and current_instance.rack_position <= instance_top
        #         ):
        #             return self.return_conflict(current_instance)
        #         elif (
        #             current_instance_top >= instance_bottom
        #             and current_instance_top <= instance_top
        #         ):
        #             return self.return_conflict(current_instance)

        # for p_connection in instance.power_connections:
        #     char1 = p_connection[0].upper()
        #     num = int(p_connection[1:])
        #     if char1 == "L":
        #         pdu_arr = rack.pdu_left
        #     elif char1 == "R":
        #         pdu_arr = rack.pdu_right
        #     else:
        #         return "Invalid power connection. Please specify left or right PDU."

        #     if pdu_arr[num - 1] == 1:
        #         return f"There is already an asset connected at PDU {char1}{num}. Please pick an empty PDU port."

        # connection_validation_result = self.validate_connections(
        #     instance.network_connections, instance.hostname
        # )
        # if connection_validation_result != Constants.API_SUCCESS:
        #     return connection_validation_result

        return Constants.API_SUCCESS

    def _edit_action_validate(self, cp_action):
        instance = self.instance_manager.make_instance(cp_action.new_record)

        input_validation_result = self._validate_inputs(instance)
        if input_validation_result != Constants.API_SUCCESS:
            return input_validation_result

        return Constants.API_SUCCESS

    def _decom_action_validate(self, cp_action):
        if (
            self.instance_table.get_instance_by_asset_number(
                cp_action.original_asset_number
            )
            is None
        ):
            return f"Asset with asset number {cp_action.original_asset_number} does not exist."

        return Constants.API_SUCCESS

    def _validate_inputs(self, instance):
        rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
        if rack is None:
            dbTable = self.dc_table.get_datacenter_name_by_id(instance.datacenter_id)
            return f"Rack {instance.rack_label} does not exist in datacenter {dbTable}. Instances must be created on preexisting racks"

        asset_pattern = re.compile("[0-9]{6}")
        if asset_pattern.fullmatch(str(instance.asset_number)) is None:
            return "Asset numbers must be 6 digits long and only contain numbers."

        if instance.hostname is not None and instance.hostname != "":
            if len(instance.hostname) > 64:
                return "Hostnames must be 64 characters or less"

            host_pattern = re.compile("[a-zA-Z]*[A-Za-z0-9-]*[A-Za-z0-9]")
            if host_pattern.fullmatch(instance.hostname) is None:
                return "Hostnames must start with a letter, only contain letters, numbers, periods, and hyphens, and end with a letter or number."

        rack_u_pattern = re.compile("[0-9]+")
        if rack_u_pattern.fullmatch(str(instance.rack_position)) is None:
            return "The value for Rack U must be a positive integer."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return f"The owner {instance.owner} is not an existing user. Please enter the username of an existing user."

        return Constants.API_SUCCESS
