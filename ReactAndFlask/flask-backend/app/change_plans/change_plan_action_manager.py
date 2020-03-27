from app.constants import Constants
from app.dal.change_plan_action_table import ChangePlanActionTable
from app.data_models.change_plan_action import ChangePlanAction
from app.exceptions.InvalidInputsException import InvalidInputsError


class ChangePlanActionManager:
    def __init__(self):
        self.cp_action_table = ChangePlanActionTable()

    def create_change_plan_action(self, cp_action_data):
        pass

    def delete_change_plan_action(self, cp_action_data):
        pass

    def edit_change_plan_action(self, cp_action_data):
        pass

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

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
