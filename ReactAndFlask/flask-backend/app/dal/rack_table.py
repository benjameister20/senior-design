from typing import List, Optional

from app.dal.database import DBWriteException, db
from app.data_models.rack import Rack


class RackEntry(db.Model):
    __tablename__ = "racks"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    row_letter = db.Column(db.String(80))
    row_number = db.Column(db.Integer)

    def __init__(self, rack: Rack):
        self.row_letter = rack.row_letter
        self.row_number = rack.row_number


class RackTable:
    def get_rack(self, row_letter: str, row_number: int) -> Optional[Rack]:
        """ Get the rack for the given letter and number """
        rack: RackEntry = RackEntry.query.filter_by(
            row_letter=row_letter, row_number=row_number
        ).first()
        if rack is None:
            return None

        return Rack(row_letter=rack.row_letter, row_number=rack.row_number)

    def add_rack(self, rack: Rack) -> None:
        """ Adds a rack to the database """
        rack_entry: RackEntry = RackEntry(rack=rack)

        try:
            db.session.add(rack_entry)
            db.session.commit()
        except:
            print(f"Failed to add rack {rack.row_letter}{rack.row_number}")
            raise DBWriteException

    def delete_rack(self, rack: Rack) -> None:
        """ Removes a rack from the database """
        try:
            RackEntry.query.filter_by(
                row_letter=rack.row_letter, row_number=rack.row_number
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete rack {rack.row_letter}{rack.row_number}")

    def get_all_racks(self) -> List[Rack]:
        """ Get a list of all racks """
        all_racks: List[RackEntry] = RackEntry.query.all()

        return [
            Rack(row_letter=entry.row_letter, row_number=entry.row_number,)
            for entry in all_racks
        ]
