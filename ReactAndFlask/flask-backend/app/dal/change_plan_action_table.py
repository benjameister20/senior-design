from typing import List

from app.constants import Constants
from app.dal.database import DBWriteException, db
from app.data_models.change_plan_action import ChangePlanAction
from sqlalchemy import and_
from sqlalchemy.dialects import postgresql as pg


class ChangePlanActionEntry(db.Model):
    __tablename__ = "changePlanAction"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)

    change_plan_id = db.Column(db.Integer)
    step = db.Column(db.Integer)
    action = db.Column(db.String(32))
    original_asset_number = db.Column(db.Integer)
    new_record = db.Column(pg.JSON, nullable=True)

    def __init__(self, change_plan_action: ChangePlanAction):
        self.change_plan_id = change_plan_action.change_plan_id
        self.step = change_plan_action.step
        self.action = change_plan_action.action
        self.original_asset_number = change_plan_action.original_asset_number
        self.new_record = change_plan_action.new_record

    def make_change_plan_action(self) -> ChangePlanAction:
        """ Convert the database entry to a datacenter """
        return ChangePlanAction(
            change_plan_id=self.change_plan_id,
            step=self.step,
            action=self.action,
            original_asset_number=self.original_asset_number,
            new_record=self.new_record,
        )


class ChangePlanActionTable:
    def get_actions_by_change_plan_id(
        self, change_plan_id: int
    ) -> List[ChangePlanAction]:
        """ Returns all change plan actions associated with a change plan """
        change_plan_action_entries: ChangePlanActionEntry = ChangePlanActionEntry.query.filter_by(
            change_plan_id=change_plan_id
        ).order_by(
            ChangePlanActionEntry.step
        ).all()
        if change_plan_action_entries is None:
            return None

        return [entry.make_change_plan_action() for entry in change_plan_action_entries]

    def add_change_plan_action(self, change_plan_action: ChangePlanAction) -> None:
        """ Adds a change plan action to the database """
        change_plan_action_entry: ChangePlanActionEntry = ChangePlanActionEntry(
            change_plan_action=change_plan_action
        )

        try:
            db.session.add(change_plan_action_entry)
            db.session.commit()
        except:
            print(
                f"Failed to add change plan action for asset {change_plan_action.original_asset_number}"
            )
            raise DBWriteException

    def edit_change_plan_actio(
        self, original_step: int, change_plan_action: ChangePlanAction
    ) -> None:
        """ Updates a change plan action """
        try:
            conditions = []
            conditions.append(
                ChangePlanActionEntry.change_plan_id
                == change_plan_action.change_plan_id
            )
            conditions.append(ChangePlanActionEntry.step == original_step)
            conditions.append(ChangePlanActionEntry.action != Constants.COLLATERAL_KEY)

            old_entry: ChangePlanActionEntry = ChangePlanActionEntry.query.filter(
                and_(*conditions)
            ).first()

            old_entry.step = change_plan_action.step
            old_entry.action = change_plan_action.action
            old_entry.original_asset_number = change_plan_action.original_asset_number
            old_entry.new_record = change_plan_action.new_record

            if original_step != change_plan_action.step:
                self._edit_change_plan_sequence(
                    change_plan_action.change_plan_id,
                    original_step,
                    change_plan_action.step,
                )

            db.session.commit()
        except:
            print(
                f"Failed to update change plan action on asset {change_plan_action.original_asset_number}"
            )

    def delete_change_plan_action(self, change_plan_action: ChangePlanAction) -> None:
        """ Removes a change plan action from the database """
        try:
            ChangePlanActionEntry.query.filter_by(
                change_plan_id=change_plan_action.change_plan_id,
                step=change_plan_action.step,
            ).delete()
            db.session.commit()
        except:
            print("Failed to delete change plan action")

    def delete_all_actions_for_change_plan(self, change_plan_id: int) -> None:
        """ Removes all change plan actions for a change plan from the database """
        try:
            ChangePlanActionEntry.query.filter_by(
                change_plan_id=change_plan_id,
            ).delete()
            db.session.commit()
        except:
            print("Failed to delete change plan action")

    def get_newest_asset_record_in_plan(
        self, change_plan_id: int, original_asset_number: int
    ) -> ChangePlanAction:
        change_plan_action_entry: ChangePlanActionEntry = ChangePlanActionEntry.query.filter_by(
            change_plan_id=change_plan_id, original_asset_number=original_asset_number
        ).order_by(
            ChangePlanActionEntry.step.desc()
        ).first()

        if change_plan_action_entry is None:
            return None

        return change_plan_action_entry.make_change_plan_action()

    def _edit_change_plan_sequence(
        self, change_plan_id: int, original_step: int, new_step: int
    ) -> None:
        if original_step > new_step:
            high_step = original_step
            low_step = new_step
            increase = True
        else:
            high_step = original_step
            low_step = new_step
            increase = False

        change_plan_action_entries: List[
            ChangePlanActionEntry
        ] = self._get_change_plan_actions_between_steps(
            change_plan_id, low_step, high_step
        )
        for entry in change_plan_action_entries:
            if entry.step == original_step:
                entry.step = new_step
                continue

            if increase:
                entry.step += 1
            else:
                entry.step -= 1

    def _get_change_plan_actions_between_steps(
        self, change_plan_id: int, low_step: int, high_step: int
    ) -> List[ChangePlanActionEntry]:
        """ Returns a list of change plan actions that occur in a sequence in a change plan """
        conditions = []
        conditions.append(ChangePlanActionEntry.change_plan_id == change_plan_id)
        conditions.append(ChangePlanActionEntry.step >= low_step)
        conditions.append(ChangePlanActionEntry.step <= high_step)

        change_plan_action_entries: List[
            ChangePlanActionEntry
        ] = ChangePlanActionEntry.query.filter(and_(*conditions)).all()

        return change_plan_action_entries
