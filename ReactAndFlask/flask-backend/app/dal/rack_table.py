from typing import List, Optional

from app.dal.database import DBWriteException, db
from app.data_models.rack import Rack
from sqlalchemy.exc import IntegrityError


class RackEntry(db.Model):
    __tablename__ = "racks"

    label = db.Column(db.String(80), primary_key=True, unique=True)

    def __init__(self, rack: Rack):
        self.label = rack.label

    def make_rack(self) -> Rack:
        """ Convert the database entry to a rack """
        return Rack(label=self.label)


class RackTable:
    def get_rack(self, label: str) -> Optional[Rack]:
        """ Get the rack for the given label """
        rack_entry: RackEntry = RackEntry.query.filter_by(label=label).first()
        if rack_entry is None:
            return None

        return rack_entry.make_rack()

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

    def delete_rack(self, rack: Rack) -> None:
        """ Removes a rack from the database """
        try:
            RackEntry.query.filter_by(label=rack.label).delete()
            db.session.commit()
        except:
            print(f"Failed to delete rack {rack.label}")

    def get_all_racks(self) -> List[Rack]:
        """ Get a list of all racks """
        all_racks: List[RackEntry] = RackEntry.query.all()

        return [entry.make_rack() for entry in all_racks]
