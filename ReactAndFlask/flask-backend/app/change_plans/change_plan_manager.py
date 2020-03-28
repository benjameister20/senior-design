import datetime
from typing import Any, Dict, List

from app.constants import Constants
from app.dal.change_plan_action_table import ChangePlanActionTable
from app.dal.change_plan_table import ChangePlanTable
from app.data_models.change_plan import ChangePlan
from app.data_models.change_plan_action import ChangePlanAction
from app.decommissions.decommission_manager import DecommissionManager
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_manager import InstanceManager


class ChangePlanManager:
    def __init__(self):
        self.cp_table = ChangePlanTable()
        self.cp_action_table = ChangePlanActionTable()
        self.instance_manager = InstanceManager()
        self.decommission_manager = DecommissionManager()

    def create_change_plan(self, cp_data):
        try:
            new_change_plan = self.make_cp(cp_data)
            self.cp_table.add_change_plan(new_change_plan)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to create the change plan."
            )

    def delete_change_plan(self, cp_data):
        try:
            identifier = self.check_null(cp_data.get(Constants.CHANGE_PLAN_ID_KEY))
            change_plan = self.cp_table.get_change_plan(identifier)
            if change_plan is None:
                raise InvalidInputsError("Could not find change plan to be deleted.")

            if change_plan.executed:
                raise InvalidInputsError(
                    "Cannot delete a change plan that has been executed."
                )

            self.cp_action_table.delete_all_actions_for_change_plan(identifier)
            self.cp_table.delete_change_plan_by_id(identifier)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to delete the change plan."
            )

    def edit_change_plan(self, cp_data):
        try:
            identifier = self.check_null(cp_data.get(Constants.CHANGE_PLAN_ID_KEY))
            name = self.check_null(cp_data.get(Constants.NAME_KEY))

            change_plan = self.cp_table.get_change_plan(identifier)
            if change_plan is None:
                raise InvalidInputsError("Could not find change plan to be edited.")

            if change_plan.executed:
                raise InvalidInputsError(
                    "Cannot update a change plan that has been executed."
                )

            change_plan.name = name
            self.cp_table.edit_change_plan(change_plan)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to edit the change plan."
            )

    def get_change_plans(self, cp_data):
        try:
            cp_owner = cp_data.get(Constants.OWNER_KEY)
            print(cp_owner)
            cp_list = self.cp_table.get_change_plan_by_owner(cp_owner)
            print("CP LIST")
            print(cp_list)
            return cp_list
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to retrieve your change plans."
            )

    def execute_cp(self, cp_data):
        try:
            identifier = self.check_null(cp_data.get(Constants.CHANGE_PLAN_ID_KEY))
            owner = self.check_null(cp_data.get(Constants.OWNER_KEY))
            change_plan_actions: List[
                ChangePlanAction
            ] = self.cp_action_table.get_actions_by_change_plan_id(identifier)

            # Execute actions in change plan
            for cp_action in change_plan_actions:
                self._execute_action(cp_action, owner)

            # Update change plan with executed and timestamp
            change_plan: ChangePlan = self.cp_table.get_change_plan(identifier)
            change_plan.executed = True
            change_plan.timestamp = datetime.datetime.now()
            print("TIMESTAMP", change_plan.timestamp)
            self.cp_table.edit_change_plan(change_plan)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to execute the change plan."
            )

    def make_cp(self, cp_data) -> ChangePlan:
        try:
            owner = self.check_null(cp_data.get(Constants.OWNER_KEY))
            name = self.check_null(cp_data.get(Constants.NAME_KEY))
            executed = bool(
                self.check_null(cp_data.get(Constants.EXECUTED_KEY)) == "True"
            )
            timestamp = self.check_null(cp_data.get(Constants.TIMESTAMP_KEY))

            if cp_data.get(Constants.CHANGE_PLAN_ID_KEY) is None:
                identifier = -1
            else:
                identifier = cp_data.get(Constants.CHANGE_PLAN_ID_KEY)

            return ChangePlan(owner, name, executed, timestamp, identifier,)
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

    def _execute_action(self, cp_action: ChangePlanAction, owner: str):
        asset_data = cp_action.new_record
        asset_data[Constants.IS_CHANGE_PLAN_KEY] = True
        if cp_action.action == Constants.CREATE_KEY:
            self.instance_manager.create_instance(asset_data)
        elif cp_action.action == Constants.UPDATE_KEY:
            asset_data[
                Constants.ASSET_NUMBER_ORIG_KEY
            ] = cp_action.original_asset_number
            self.instance_manager.edit_instance(asset_data)
        elif cp_action.action == Constants.DECOMMISSION_KEY:
            decom_data: Dict[str, Any] = {}
            decom_data[Constants.IS_CHANGE_PLAN_KEY] = True
            decom_data[Constants.ASSET_NUMBER_KEY] = cp_action.original_asset_number
            decom_data[Constants.DECOM_USER_KEY] = owner
            self.decommission_manager.decommission_asset(decom_data)

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
