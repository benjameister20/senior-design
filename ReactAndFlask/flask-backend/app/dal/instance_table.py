from typing import List, Optional

from app.dal.database import DBWriteException, db
from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.dal.rack_table import RackEntry
from app.data_models.instance import Instance
from sqlalchemy import and_


class InstanceEntry(db.Model):
    __tablename__ = "instances"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    model_id = db.Column(db.Integer)
    hostname = db.Column(db.String(80))
    rack_label = db.Column(db.String(80))
    rack_u = db.Column(db.Integer)
    owner = db.Column(db.String(80), nullable=True)
    comment = db.Column(db.String(80), nullable=True)

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


class RackDoesNotExistError(Exception):
    """
    Raised when a rack does not already exist
    """

    def __init__(self, rack_label: str):
        self.message: str = f"Rack {rack_label} does not exist."


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

    def get_instance_by_hostname(self, hostname):
        """ Get the instance for the given hostname """
        instance_entry: InstanceEntry = InstanceEntry.query.filter_by(
            hostname=hostname
        ).first()
        if instance_entry is None:
            return None

        return instance_entry

    def add_instance(self, instance: Instance) -> None:
        """ Adds an instance to the database """
        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            db.session.add(instance_entry)
            db.session.commit()
        except:
            print(f"Failed to add instance {instance.hostname} {instance.rack_label}")

    def edit_instance(self, instance: Instance, original_rack, original_rack_u) -> None:
        """ Updates a model to the database """
        # instance_entry: InstanceEntry = InstanceEntry(instance=instance)
        print("ORIG + ORIG_U")
        print(original_rack)
        print(original_rack_u)
        try:
            # InstanceEntry.query.filter_by(
            #     rack_label=original_rack, rack_u=original_rack_u
            # ).update(instance_entry)
            old_entry = InstanceEntry.query.filter_by(
                rack_label=original_rack, rack_u=original_rack_u
            ).first()
            old_entry.model_id = instance.model_id
            old_entry.hostname = instance.hostname
            old_entry.rack_label = instance.rack_label
            old_entry.rack_u = instance.rack_u
            old_entry.owner = instance.owner
            old_entry.comment = instance.comment
            db.session.commit()
        except:
            raise ChangeModelDBException(
                f"Failed to udpate instance {instance.model_id}"
            )

    def add_or_update(self, instance: Instance) -> None:
        """" Adds a model or updates it if it already exists """
        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            result: InstanceEntry = InstanceEntry.query.filter_by(
                rack_label=instance.rack_label, rack_u=instance.rack_u
            ).first()

            if result is not None:
                InstanceEntry.query.filter_by(
                    rack_label=instance.rack_label, rack_u=instance.rack_u
                ).update(instance_entry)
            else:
                # Add new instance to database, only if rack exists
                rack_result: RackEntry = RackEntry.query.filter_by(
                    label=instance.rack_label
                ).first()
                if rack_result is not None:
                    db.session.add(instance_entry)
                else:
                    raise RackDoesNotExistError(rack_label=instance.rack_label)

            db.session.commit()
        except RackDoesNotExistError:
            raise
        except:
            raise DBWriteException(
                message=f"Failed to udpate instance {instance.rack_label} {instance.rack_u}"
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
        ).all()

        return [entry.make_instance() for entry in instance_entries]

    def get_all_instances(self) -> List[Instance]:
        """ Get a list of all racks """
        instance_entries: List[InstanceEntry] = InstanceEntry.query.all()

        return [entry.make_instance() for entry in instance_entries]

    def get_instances_by_model_id(self, model_id):
        instance_entries: List[InstanceEntry] = InstanceEntry.query.filter_by(
            model_id=model_id
        ).all()
        print("INSTANCE ENTRIES")
        print(instance_entries)
        print(model_id)
        if instance_entries is None or len(instance_entries) == 0:
            return None

        return [entry.make_instance() for entry in instance_entries]

    def get_instances_with_filters(
        self,
        model_id: Optional[int],
        hostname: Optional[str],
        rack_label: Optional[str],
        rack_u: Optional[int],
        limit: int,
    ) -> List[Instance]:
        """ Get a list of all instances containing the given filter """
        conditions = []
        if model_id is not None and model_id != "":
            conditions.append(InstanceEntry.model_id == model_id)
        if hostname is not None and hostname != "":
            conditions.append(InstanceEntry.hostname == hostname)
        if rack_label is not None and rack_label != "":
            conditions.append(InstanceEntry.rack_label == rack_label)
        if rack_u is not None and rack_u != "":
            conditions.append(InstanceEntry.rack_u == rack_u)

        filtered_instances: List[InstanceEntry] = InstanceEntry.query.filter(
            and_(*conditions)
        ).limit(limit)

        if filtered_instances is None:
            return None

        return [entry.make_instance() for entry in filtered_instances]
