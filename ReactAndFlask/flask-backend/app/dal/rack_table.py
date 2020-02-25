from typing import List, Optional

from app.dal.database import DBWriteException, db
from app.data_models.rack import Rack
from sqlalchemy.dialects import postgresql as pg
from sqlalchemy.exc import IntegrityError


class RackEntry(db.Model):
    __tablename__ = "racks"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    label = db.Column(db.String(80))
    datacenter_id = db.Column(db.Integer)
    pdu_left = db.Column(pg.ARRAY(db.Integer))
    pdu_right = db.Column(pg.ARRAY(db.Integer))

    def __init__(self, rack: Rack):
        self.label = rack.label
        self.datacenter_id = rack.datacenter_id
        self.pdu_left = rack.pdu_left
        self.pdu_right = rack.pdu_right

    def make_rack(self) -> Rack:
        """ Convert the database entry to a rack """
        return Rack(
            label=self.label,
            datacenter_id=self.datacenter_id,
            pdu_left=self.pdu_left,
            pdu_right=self.pdu_right,
        )


class RackTable:
    def get_rack(self, label: str, datacenter_id: int) -> Optional[Rack]:
        """ Get the rack for the given label """
        rack_entry: RackEntry = RackEntry.query.filter_by(
            label=label, datacenter_id=datacenter_id
        ).first()
        if rack_entry is None:
            return None

        return rack_entry.make_rack()

    def get_rack_by_datacenter(self, datacenter_id):
        rack_entries: RackEntry = RackEntry.query.filter_by(
            datacenter_id=datacenter_id
        ).all()
        if rack_entries is None:
            return None

        return [entry.make_rack() for entry in rack_entries]

    def add_rack(self, rack: Rack) -> None:
        """ Adds a rack to the database """
        rack_entry: RackEntry = RackEntry(rack=rack)

        try:
            db.session.add(rack_entry)
            db.session.commit()
        except IntegrityError:
            print(f"Unable to add duplicate rack {rack_entry.label}")
            raise DBWriteException(f"Unable to add duplicate rack {rack_entry.label}")
        except:
            print(f"Failed to add rack {rack_entry.label}")
            raise DBWriteException

    def delete_rack(self, label: str, datacenter_id: int) -> None:
        """ Removes a rack from the database """
        try:
            RackEntry.query.filter_by(label=label, datacenter_id=datacenter_id).delete()
            db.session.commit()
        except:
            print(f"Failed to delete rack {label}")

    def get_all_racks(self) -> List[Rack]:
        """ Get a list of all racks """
        all_racks: List[RackEntry] = RackEntry.query.all()

        return [entry.make_rack() for entry in all_racks]
