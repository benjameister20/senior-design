from typing import Optional

from app.dal.database import DBWriteException, db
from app.data_models.datacenter import Datacenter
from sqlalchemy.exc import IntegrityError


class DatacenterEntry(db.Model):
    __tablename__ = "datacenters"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    abbreviation = db.Column(db.String(10), unique=True)
    name = db.Column(db.String(128), unique=True)

    def __init__(self, datacenter: Datacenter):
        self.abbreviation = datacenter.abbreviation
        self.name = datacenter.name

    def make_datacenter(self) -> Datacenter:
        """ Convert the database entry to a datacenter """
        return Datacenter(abbreviation=self.abbreviation, name=self.name)


class DatacenterTable:
    def add_datacenter(self, datacenter: Datacenter) -> None:
        """ Adds a datacenter to the database """
        datacenter_entry: DatacenterEntry = DatacenterEntry(datacenter=datacenter)

        try:
            db.session.add(datacenter_entry)
            db.session.commit()
        except IntegrityError:
            print(f"Unable to add duplicate datacenter {datacenter_entry.name}")
            raise DBWriteException(
                f"Unable to add duplicate rack {datacenter_entry.name}"
            )
        except:
            print(f"Failed to add datacenter {datacenter_entry.name}")
            raise DBWriteException

    def delete_datacenter_by_name(self, name: str) -> None:
        """ Removes a datacenter from the database """
        try:
            DatacenterEntry.query.filter_by(name=name).delete()
            db.session.commit()
        except:
            print(f"Failed to delete datacenter {name}")

    def get_datacenter_id_by_name(self, name: str) -> Optional[int]:
        datacenter: DatacenterEntry = DatacenterEntry.query.filter_by(name=name).first()
        if datacenter is None:
            return None

        return datacenter.identifier
