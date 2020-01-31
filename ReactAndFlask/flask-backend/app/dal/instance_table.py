from typing import List, Optional

from app.dal.database import db
from app.data_models.instance import Instance
from app.data_models.rack import Rack


class InstanceEntry(db.Model):
    __tablename__ = "instances"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    model_id = db.Column(db.Integer)
    hostname = db.Column(db.String(80))
    row_letter = db.Column(db.String(80))
    row_number = db.Column(db.Integer)
    rack_u = db.Column(db.Integer)
    owner = db.Column(db.String(80))
    comment = db.Column(db.String(80))

    def __init__(self, instance: Instance):
        self.model_id = instance.model_id
        self.hostname = instance.hostname
        self.row_letter = instance.rack.row_letter
        self.row_number = instance.rack.row_number
        self.rack_u = instance.rack_u
        self.owner = instance.owner
        self.comment = instance.comment


class InstanceTable:
    def get_instance(self, identifier: int) -> Optional[Instance]:
        """ Get the instance for the given idr """
        instance: InstanceEntry = InstanceEntry.query.filter_by(
            identifier=identifier
        ).first()
        if instance is None:
            return None

        return Instance(
            model_id=instance.model_id,
            hostname=instance.hostname,
            rack=Rack(row_letter=instance.row_letter, row_number=instance.row_number),
            rack_u=instance.rack_u,
            owner=instance.owner,
            comment=instance.comment,
        )

    def get_instance_by_rack_location(self, rack, rack_u):
        """ Get the instance for the given idr """
        instance: InstanceEntry = InstanceEntry.query.filter_by(
            rack=rack, rack_u=rack_u,
        ).first()
        if instance is None:
            return None

        return Instance(
            model_id=instance.model_id,
            hostname=instance.hostname,
            rack=instance.rack,
            rack_u=instance.rack_u,
            owner=instance.owner,
            comment=instance.comment,
        )

    def add_instance(self, instance: Instance) -> None:
        """ Adds an instance to the database """
        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            db.session.add(instance_entry)
            db.session.commit()
        except:
            print(
                f"Failed to add instance {instance.hostname} {instance.rack.row_letter}{instance.rack.row_number}"
            )

    def delete_instance(self, instance: Instance) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                hostname=instance.hostname,
                row_letter=instance.rack.row_letter,
                row_number=instance.rack.row_number,
                rack_u=instance.rack_u,
            ).delete()
            db.session.commit()
        except:
            print(
                f"Failed to delete instance {instance.hostname} {instance.rack.row_letter}{instance.rack.row_number}"
            )

    def delete_instance_by_rack_location(self, row_letter, row_number, rack_u) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                row_letter=row_letter, row_number=row_number, rack_u=rack_u,
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete instance {row_letter}{row_number}{rack_u}")

    def get_all_instances(self) -> List[Instance]:
        """ Get a list of all racks """
        all_instances: List[InstanceEntry] = InstanceEntry.query.all()

        return [
            Instance(
                model_id=instance.model_id,
                hostname=instance.hostname,
                rack=Rack(
                    row_letter=instance.row_letter, row_number=instance.row_number
                ),
                rack_u=instance.rack_u,
                owner=instance.owner,
                comment=instance.comment,
            )
            for instance in all_instances
        ]
