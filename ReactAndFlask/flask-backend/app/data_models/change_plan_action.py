from typing import Any, Dict

from app.constants import Constants
from app.main.types import JSON


class ChangePlanAction:
    """
    A data model for a change plan action

    Attributes:
        change_plan_id (int): reference to what change plan the action belongs to
        step (int): step in the sequence of the change plan indicating order
        action (str): create/delete/update/collateral indicating type of action done on the object
        original_asset_number (int): reference to original aasset being affected
        new_record (Dict[str, Any]): record of what asset will look like after change
    """

    def __init__(
        self,
        change_plan_id: int,
        step: int,
        action: str,
        original_asset_number: int,
        new_record: Dict[str, Any],
    ) -> None:
        self.change_plan_id: int = change_plan_id
        self.step: int = step
        self.action: str = action
        self.original_asset_number: int = original_asset_number
        self.new_record: Dict[str, Any] = new_record

    def make_json(self) -> JSON:
        return {
            Constants.CHANGE_PLAN_ID_KEY: self.change_plan_id,
            Constants.STEP_KEY: self.step,
            Constants.ACTION_KEY: self.action,
            Constants.ASSET_NUMBER_ORIG_KEY: self.original_asset_number,
            Constants.NEW_RECORD_KEY: self.new_record,
        }
