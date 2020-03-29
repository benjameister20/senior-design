from typing import List

from app.change_plans.change_plan_validator import ChangePlanValidator
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
        self.validator = ChangePlanValidator()
        self.instance_table = InstanceTable()
        self.instance_manager = InstanceManager()

    def create_change_plan_action(self, cp_action_data):
        try:
            change_plan_action: ChangePlanAction = self.make_cp_action(cp_action_data)
            print("VALIDATIG CP ACTION")
            validaiton_result = self.validator.validate_action(change_plan_action)
            print("VALIDATED", validaiton_result)
            if validaiton_result != Constants.API_SUCCESS:
                raise InvalidInputsError(validaiton_result)

            self.cp_action_table.add_change_plan_action(change_plan_action)

            if change_plan_action.action == Constants.CREATE_KEY:
                self._add_create_collateral(change_plan_action)
            elif change_plan_action.action == Constants.UPDATE_KEY:
                self._add_create_collateral(change_plan_action)
            elif change_plan_action.action == Constants.DECOMMISSION_KEY:
                self._add_decommission_collateral(change_plan_action)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to create the change plan action."
            )

    def delete_change_plan_action(self, cp_action_data):
        try:
            cp_id = cp_action_data.get(Constants.CHANGE_PLAN_ID_KEY)
            cp_step = cp_action_data.get(Constants.STEP_KEY)
            if cp_id is None or cp_step is None:
                raise InvalidInputsError(
                    "Must provide both a change plan id and step to delete."
                )
            self.cp_action_table.delete_change_plan_action(cp_id, cp_step)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to delete the change plan action."
            )

    def edit_change_plan_action(self, cp_action_data):
        try:
            original_step = cp_action_data.get(Constants.ORIGINAL_STEP_KEY)
            change_plan_action = self.make_cp_action(cp_action_data)

            validaiton_result = self.validator.validate_action(change_plan_action)
            if validaiton_result != Constants.API_SUCCESS:
                raise InvalidInputsError(validaiton_result)

            self.cp_action_table.edit_change_plan_actio(
                original_step, change_plan_action
            )

            if change_plan_action.action == Constants.CREATE_KEY:
                self._add_create_collateral(change_plan_action)
            elif change_plan_action.action == Constants.UPDATE_KEY:
                self._add_create_collateral(change_plan_action)
            elif change_plan_action.action == Constants.DECOMMISSION_KEY:
                self._add_decommission_collateral(change_plan_action)
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to edit the change plan action."
            )

    def get_change_plan_actions(self, cp_id) -> List[ChangePlanAction]:
        try:
            change_plan_actions: List[
                ChangePlanAction
            ] = self.cp_action_table.get_actions_by_change_plan_id(cp_id)
            for cp_action in change_plan_actions:
                if cp_action.action == Constants.CREATE_KEY:
                    cp_action.diff = cp_action.new_record
                    continue
                prev_record = self.get_prev_record(cp_action)
                cp_action.old_record = prev_record

                # Diff records
                diff = {}
                for key in cp_action.old_record.keys():
                    if (
                        key == "network_ports"
                        or key == "height"
                        or key == "abbreviation"
                    ):
                        continue

                    if cp_action.old_record[key] != cp_action.new_record[key]:
                        diff[key] = [
                            cp_action.old_record[key],
                            cp_action.new_record[key],
                        ]

                cp_action.diff = diff

            return change_plan_actions
        except Exception as e:
            print(str(e))
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
            if original_asset_number == "":
                original_asset_number = -1

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
            cp_action.change_plan_id, cp_action.original_asset_number, cp_action.step
        )
        if prev_change_plan_update is not None:
            return prev_change_plan_update.new_record

        original_record: Instance = self.instance_table.get_instance_by_asset_number(
            cp_action.original_asset_number
        )
        if original_record is None:
            return {}

        model = self.instance_manager.get_model_from_id(original_record.model_id)
        datacenter = self.instance_manager.get_dc_from_id(original_record.datacenter_id)

        return original_record.make_json_with_model_and_datacenter(model, datacenter)

    def _add_create_collateral(self, cp_action: ChangePlanAction):
        try:
            new_record = cp_action.new_record
            network_connections = new_record[Constants.NETWORK_CONNECTIONS_KEY]
            for port in network_connections:
                connection_hostname = network_connections[port]["connection_hostname"]
                connection_port = network_connections[port]["connection_port"]

                if connection_hostname == "" and connection_port == "":
                    continue

                other_instance = self.instance_table.get_instance_by_hostname(
                    connection_hostname
                )
                if other_instance is None:
                    cp_action_list: List[
                        ChangePlanAction
                    ] = self.cp_action_table.get_actions_by_change_plan_id(
                        cp_action.change_plan_id
                    )
                    for prev_action in cp_action_list:
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
                        raise InvalidInputsError(
                            f"An error occurred when attempting to update the proposed network connection. Could not find asset with hostname {connection_hostname}."
                        )

                other_instance.network_connections[connection_port][
                    "connection_hostname"
                ] = new_record[Constants.HOSTNAME_KEY]
                other_instance.network_connections[connection_port][
                    "connection_port"
                ] = port

                model = self.instance_manager.get_model_from_id(other_instance.model_id)
                datacenter = self.instance_manager.get_dc_from_id(
                    other_instance.datacenter_id
                )

                other_instance_record = other_instance.make_json_with_model_and_datacenter(
                    model, datacenter
                )
                collateral_action = ChangePlanAction(
                    change_plan_id=cp_action.change_plan_id,
                    step=cp_action.step,
                    action=Constants.COLLATERAL_KEY,
                    original_asset_number=other_instance.asset_number,
                    new_record=other_instance_record,
                )

                self.cp_action_table.add_change_plan_action(collateral_action)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "Failed to add network connection effects of change plan action."
            )

    def _add_decommission_collateral(self, cp_action: ChangePlanAction):
        try:
            asset_data = self.get_prev_record(cp_action)
            if asset_data is None:
                raise InvalidInputsError("Could not find asset to decommission.")

            asset = self.instance_manager.make_instance(asset_data)
            for port in asset.network_connections:
                connection_hostname = asset.network_connections[port][
                    "connection_hostname"
                ]
                connection_port = asset.network_connections[port]["connection_port"]

                if connection_hostname == "" and connection_port == "":
                    continue

                other_instance = self.instance_table.get_instance_by_hostname(
                    connection_hostname
                )
                if other_instance is None:
                    cp_action_list: List[
                        ChangePlanAction
                    ] = self.cp_action_table.get_actions_by_change_plan_id(
                        cp_action.change_plan_id
                    )
                    for prev_action in cp_action_list:
                        if prev_action.step >= cp_action.step:
                            continue

                        if (
                            prev_action.new_record[Constants.HOSTNAME_KEY]
                            == connection_hostname
                        ):
                            other_instance = self.instance_manager.make_instance(
                                prev_action.new_record
                            )

                    print("OTHER INSTANCE", other_instance)
                    if other_instance is None:
                        raise InvalidInputsError(
                            f"An error occurred when attempting to update the proposed network connection. Could not find asset with hostname {connection_hostname}."
                        )

                other_instance.network_connections[connection_port][
                    "connection_hostname"
                ] = ""
                other_instance.network_connections[connection_port][
                    "connection_port"
                ] = ""

                model = self.instance_manager.get_model_from_id(other_instance.model_id)
                datacenter = self.instance_manager.get_dc_from_id(
                    other_instance.datacenter_id
                )

                other_instance_record = other_instance.make_json_with_model_and_datacenter(
                    model, datacenter
                )
                collateral_action = ChangePlanAction(
                    change_plan_id=cp_action.change_plan_id,
                    step=cp_action.step,
                    action=Constants.COLLATERAL_KEY,
                    original_asset_number=other_instance.asset_number,
                    new_record=other_instance_record,
                )

                self.cp_action_table.add_change_plan_action(collateral_action)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "Failed to add network connection effects of change plan action."
            )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
