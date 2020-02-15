from typing import List, Optional, Tuple

from app.dal.database import DBWriteException, db
from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.dal.rack_table import RackEntry
from app.data_models.instance import Instance
from app.main.types import JSON
from sqlalchemy import and_
from sqlalchemy.dialects import postgresql as pg


class InstanceEntry(db.Model):
    __tablename__ = "instances"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    model_id = db.Column(db.Integer)
    hostname = db.Column(db.String(80), nullable=True)
    rack_label = db.Column(db.String(80))
    rack_position = db.Column(db.Integer)
    owner = db.Column(db.String(80), nullable=True)
    comment = db.Column(db.String(80), nullable=True)
    datacenter_id = db.Column(db.Integer)
    mac_addresses = db.Column(pg.ARRAY(db.String(50)), nullable=True)
    network_connections = db.Column(pg.ARRAY(db.String(50)), nullable=True)
    power_connections = db.Column(pg.ARRAY(db.String(50)), nullable=True)
    asset_number = db.Column(db.Integer)

    def __init__(self, instance: Instance):
        self.model_id = instance.model_id
        self.hostname = instance.hostname
        self.rack_label = instance.rack_label
        self.rack_position = instance.rack_position
        self.owner = instance.owner
        self.comment = instance.comment
        self.datacenter_id = instance.datacenter_id
        self.mac_addresses = instance.mac_address
        self.network_connections = instance.network_connections
        self.power_connections = instance.power_connections
        self.asset_number = instance.asset_number

    def make_instance(self) -> Instance:
        """ Convert the database entry to an instance """
        return Instance(
            model_id=self.model_id,
            hostname=self.hostname,
            rack_label=self.rack_label,
            rack_position=self.rack_position,
            owner=self.owner,
            comment=self.comment,
            datacenter_id=self.datacenter_id,
            mac_address=self.mac_addresses,
            network_connections=self.network_connections,
            power_connections=self.power_connections,
            asset_number=self.asset_number,
        )

    def make_json(self) -> JSON:
        return {
            "model_id": self.model_id,
            "hostname": self.hostname,
            "rack_label": self.rack_label,
            "rack_position": self.rack_position,
            "owner": self.owner,
            "comment": self.comment,
            "datacenter_id": self.datacenter_id,
            "mac_address": self.mac_addresses,
            "network_connections": self.network_connections,
            "power_connections": self.power_connections,
            "asset_number": self.asset_number,
        }


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

    def get_instance_by_rack_location(self, rack_label, rack_position, datacenter_id):
        """ Get the instance for the given rack location """
        instance_entry: InstanceEntry = InstanceEntry.query.filter_by(
            rack_label=rack_label,
            rack_position=rack_position,
            datacenter_id=datacenter_id,
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

    def get_instance_by_asset_number(self, asset_number):
        """ Get the instance for the given hostname """
        instance_entry: InstanceEntry = InstanceEntry.query.filter_by(
            asset_number=asset_number
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
            print(f"Failed to add asset {instance.hostname} {instance.rack_label}")

    def edit_instance(self, instance: Instance, original_asset_number) -> None:
        """ Updates a model to the database """
        try:
            old_entry = InstanceEntry.query.filter_by(
                asset_number=original_asset_number
            ).first()
            old_entry.model_id = instance.model_id
            old_entry.hostname = instance.hostname
            old_entry.rack_label = instance.rack_label
            old_entry.rack_position = instance.rack_position
            old_entry.owner = instance.owner
            old_entry.comment = instance.comment
            old_entry.datacenter_id = instance.datacenter_id
            old_entry.mac_addresses = instance.mac_address
            old_entry.network_connections = instance.network_connections
            old_entry.power_connections = instance.power_connections
            old_entry.asset_number = instance.asset_number
            db.session.commit()
        except:
            raise ChangeModelDBException(f"Failed to udpate asset {instance.model_id}")

    def add_or_update(self, instance: Instance) -> Tuple[int, int, int]:
        """" Adds a model or updates it if it already exists """
        instance_entry: InstanceEntry = InstanceEntry(instance=instance)

        try:
            result: InstanceEntry = InstanceEntry.query.filter_by(
                rack_label=instance.rack_label,
                rack_position=instance.rack_position,
                datacenter_id=instance.datacenter_id,
            ).first()

            add, update, ignore = False, False, False
            if result is not None:
                if result.make_instance() == instance:
                    ignore = True
                else:
                    InstanceEntry.query.filter_by(
                        rack_label=instance.rack_label,
                        rack_position=instance.rack_position,
                        datacenter_id=instance.datacenter_id,
                    ).update(instance_entry.make_json())
                    update = True
            else:
                # Add new instance to database, only if rack exists
                rack_result: RackEntry = RackEntry.query.filter_by(
                    label=instance.rack_label, datacenter_id=instance.datacenter_id
                ).first()
                if rack_result is not None:
                    db.session.add(instance_entry)
                else:
                    raise RackDoesNotExistError(rack_label=instance.rack_label)
                add = True
            db.session.commit()

            return int(add), int(update), int(ignore)
        except RackDoesNotExistError:
            raise
        except:
            raise DBWriteException(
                message=f"Failed to udpate asset {instance.rack_label} {instance.rack_position}"
            )

    def delete_instance(self, instance: Instance) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                rack_label=instance.rack_label,
                rack_position=instance.rack_position,
                datacenter_id=instance.datacenter_id,
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete asset {instance.hostname} {instance.rack_label}")

    def delete_instance_by_rack_location(
        self, rack_label: str, rack_position: int, datacenter_id: int
    ) -> None:
        """ Removes an instance from the database """
        try:
            InstanceEntry.query.filter_by(
                rack_label=rack_label,
                rack_position=rack_position,
                datacenter_id=datacenter_id,
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete asset {rack_label}")

    def delete_instance_by_asset_number(self, asset_number):
        try:
            InstanceEntry.query.filter_by(asset_number=asset_number).delete()
            db.session.commit()
        except:
            print(f"Failed to delete asset {asset_number}")

    def get_instances_by_rack(
        self, rack_label: str, datacenter_id: int
    ) -> List[Instance]:
        """ Get all instances for the given rack label """
        instance_entries: List[InstanceEntry] = InstanceEntry.query.filter_by(
            rack_label=rack_label, datacenter_id=datacenter_id
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
        rack_position: Optional[int],
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
        if rack_position is not None and rack_position != "":
            conditions.append(InstanceEntry.rack_position == rack_position)

        filtered_instances: List[InstanceEntry] = InstanceEntry.query.filter(
            and_(*conditions)
        ).limit(limit)

        if filtered_instances is None:
            return None

        return [entry.make_instance() for entry in filtered_instances]
