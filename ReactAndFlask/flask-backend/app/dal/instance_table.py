from typing import List, Optional

from app.dal.database import db
from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.data_models.instance import Instance


class InstanceEntry(db.Model):
    __tablename__ = "instances"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    model_id = db.Column(db.Integer)
    hostname = db.Column(db.String(80))
    rack_label = db.Column(db.String(80))
    rack_u = db.Column(db.Integer)
    owner = db.Column(db.String(80))
    comment = db.Column(db.String(80))

    def __init__(self, instance: Instance):
        self.model_id = instance.model_id
        self.hostname = instance.hostname
        self.rack_label = instance.rack_label
        self.rack_u = instance.rack_u
        self.owner = instance.owner
        self.comment = instance.comment

    def make_instance(self) -> Instance:
        """ Convert the database entry to an instance """
        return Instance(
            model_id=self.model_id,
            hostname=self.hostname,
            rack_label=self.rack_label,
            rack_u=self.rack_u,
            owner=self.owner,
            comment=self.comment,
        )


class InstanceTable:
    def get_instance(self, identifier: int) -> Optional[Instance]:
        """ Get the instance for the given idr """
        instance_entry: InstanceEntry = InstanceEntry.query.filter_by(
            identifier=identifier
        ).first()
        if instance_entry is None:
            return None

        return instance_entry.make_instance()

    def get_instance_by_rack_location(self, rack_label, rack_u):
        """ Get the instance for the given rack location """
        instance_entry: InstanceEntry = InstanceEntry.query.filter_by(
            rack_label=rack_label, rack_u=rack_u,
        ).first()
        if instance_entry is None:
            return None

        return instance_entry.make_instance()

    def add_instance(self, instance: Instance) -> None:
        """ Adds an instance to the database """
        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            db.session.add(instance_entry)
            db.session.commit()
        except:
            print(f"Failed to add instance {instance.hostname} {instance.rack_label}")

    def edit_instance(self, instance: Instance) -> None:
        """ Updates a model to the database """

        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            InstanceEntry.query.filter_by(
                rack_label=instance.rack_label, rack_u=instance.rack_u
            ).update(instance_entry)
            db.session.commit()
        except:
            raise ChangeModelDBException(
                "Failed to udpate model {model.vendor} {model.model_number}"
            )

    def delete_instance(self, instance: Instance) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                hostname=instance.hostname,
                rack_label=instance.rack_label,
                rack_u=instance.rack_u,
            ).delete()
            db.session.commit()
        except:
            print(
                f"Failed to delete instance {instance.hostname} {instance.rack_label}"
            )

    def delete_instance_by_rack_location(self, rack_label: str, rack_u: int) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                rack_label=rack_label, rack_u=rack_u,
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete instance {rack_label}")

    def get_instances_by_rack(self, rack_label: str) -> List[Instance]:
        """ Get all instances for the given rack label """
        instance_entries: List[InstanceEntry] = InstanceEntry.query.filter_by(
            rack_label=rack_label
        )

        return [entry.make_instance() for entry in instance_entries]

    def get_all_instances(self) -> List[Instance]:
        """ Get a list of all racks """
        instance_entries: List[InstanceEntry] = InstanceEntry.query.all()

        return [entry.make_instance() for entry in instance_entries]

    def get_instances_by_model_id(self, model_id):
        instance_entries: List[InstanceEntry] = InstanceEntry.query.filter_by(
            model_id=model_id
        )
        if instance_entries is None:
            return None

        return [entry.make_instance() for entry in instance_entries]
