from typing import List

from app.constants import Constants
from app.dal.change_plan_action_table import ChangePlanActionTable
from app.dal.instance_table import InstanceTable
from app.data_models.change_plan_action import ChangePlanAction
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_manager import InstanceManager


class ChangePlanActionManager:
    def __init__(self):
        self.cp_action_table = ChangePlanActionTable()
        self.instance_table = InstanceTable()
        self.instance_manager = InstanceManager()

    def create_change_plan_action(self, cp_action_data):
        pass

    def delete_change_plan_action(self, cp_action_data):
        pass

    def edit_change_plan_action(self, cp_action_data):
        pass

    def get_change_plan_actions(self, cp_id) -> List[ChangePlanAction]:
        try:
            change_plan_actions: List[
                ChangePlanAction
            ] = self.cp_action_table.get_actions_by_change_plan_id(cp_id)
            for cp_action in change_plan_actions:
                if cp_action.action == Constants.CREATE_KEY:
                    continue
                prev_record = self.get_prev_record(cp_action)
                cp_action.old_record = prev_record

            return change_plan_actions
        except:
            raise InvalidInputsError(
                "Unable to retrieve actions for the specified change plan."
            )

    def make_cp_action(self, cp_action_data) -> ChangePlanAction:
        try:
            change_plan_id = self.check_null(
                cp_action_data.get(Constants.CHANGE_PLAN_ID_KEY)
            )
            step = self.check_null(cp_action_data.get(Constants.STEP_KEY))
            action = self.check_null(cp_action_data.get(Constants.ACTION_KEY))
            original_asset_number = self.check_null(
                cp_action_data.get(Constants.ASSET_NUMBER_ORIG_KEY)
            )
            new_record = self.check_null(cp_action_data.get(Constants.NEW_RECORD_KEY))

            return ChangePlanAction(
                change_plan_id, step, action, original_asset_number, new_record
            )
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

    def get_prev_record(self, cp_action: ChangePlanAction):
        prev_change_plan_update: ChangePlanAction = self.cp_action_table.get_newest_asset_record_in_plan(
            cp_action.change_plan_id, cp_action.original_asset_number
        )
        if prev_change_plan_update is not None:
            return prev_change_plan_update.new_record

        original_record: Instance = self.instance_table.get_instance_by_asset_number(
            cp_action.original_asset_number
        )
        if original_record is None:
            return {}

        model = self.instance_manager.get_model_from_id(original_record.model_id)
        model_name = model.vendor + " " + model.model_number

        datacenter = self.instance_manager.get_dc_from_id(original_record.datacenter_id)

        return original_record.make_json_with_model_and_datacenter(
            model_name, datacenter.name
        )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
