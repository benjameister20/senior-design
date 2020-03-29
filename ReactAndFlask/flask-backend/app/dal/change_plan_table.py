from typing import List

from app.dal.database import DBWriteException, db
from app.data_models.change_plan import ChangePlan


class ChangePlanEntry(db.Model):
    __tablename__ = "changePlan"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    owner = db.Column(db.String(128))
    name = db.Column(db.String(128))
    executed = db.Column(db.Boolean)
    timestamp = db.Column(db.Date, nullable=True)

    def __init__(self, change_plan: ChangePlan):
        self.owner = change_plan.owner
        self.name = change_plan.name
        self.executed = change_plan.executed

        if change_plan.timestamp == "":
            self.timestamp = None
        else:
            self.timestamp = change_plan.timestamp

        if change_plan.identifier != -1:
            self.identifier = change_plan.identifier

    def make_change_plan(self) -> ChangePlan:
        """ Convert the database entry to a datacenter """
        return ChangePlan(
            owner=self.owner,
            name=self.name,
            executed=self.executed,
            timestamp=self.timestamp,
            identifier=self.identifier,
        )


class ChangePlanTable:
    def get_change_plan(self, identifier: int) -> ChangePlan:
        change_plan: ChangePlanEntry = ChangePlanEntry.query.filter_by(
            identifier=identifier
        ).first()
        if change_plan is None:
            return None

        return change_plan.make_change_plan()

    def get_change_plan_by_owner(self, owner: str) -> List[ChangePlan]:
        change_plan_entries: List[ChangePlanEntry] = ChangePlanEntry.query.filter_by(
            owner=owner
        ).all()
        print(change_plan_entries)
        if change_plan_entries is None:
            return None

        return [entry.make_change_plan() for entry in change_plan_entries]

    def add_change_plan(self, change_plan: ChangePlan) -> int:
        """ Adds a change plan to the database """
        change_plan_entry: ChangePlanEntry = ChangePlanEntry(change_plan=change_plan)
        print("owner", change_plan_entry.owner)
        print("id", change_plan_entry.identifier)

        try:
            db.session.add(change_plan_entry)
            print("owner", change_plan_entry.owner)
            print("id", change_plan_entry.identifier)
            db.session.commit()
        except Exception as e:
            print(f"Failed to add change plan {change_plan.name}")
            raise DBWriteException

        return change_plan_entry.identifier

    def edit_change_plan(self, change_plan: ChangePlan) -> None:
        """ Updates the information for a given change plan"""
        try:
            old_entry = ChangePlanEntry.query.filter_by(
                identifier=change_plan.identifier
            ).first()

            old_entry.owner = change_plan.owner
            old_entry.name = change_plan.name
            old_entry.executed = change_plan.executed

            if change_plan.timestamp is not None and change_plan.timestamp != "":
                old_entry.timestamp = change_plan.timestamp

            db.session.commit()
        except:
            print(f"Failed to update change plan data {change_plan.name}")

    def delete_change_plan_by_id(self, identifier: int) -> None:
        """ Removes a change plan from the database """
        try:
            ChangePlanEntry.query.filter_by(identifier=identifier).delete()
            db.session.commit()
        except:
            print("Failed to delete change plan")
