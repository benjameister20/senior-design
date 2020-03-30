from typing import List, Optional

from app.dal.database import db
from app.data_models.decommission import Decommission
from sqlalchemy import and_
from sqlalchemy.dialects import postgresql as pg


class DecommissionEntry(db.Model):
    __tablename__ = "decomission"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    vendor = db.Column(db.String(80))
    model_number = db.Column(db.String(80))
    height = db.Column(db.Integer)
    hostname = db.Column(db.String(80), nullable=True)
    rack_label = db.Column(db.String(80))
    rack_position = db.Column(db.Integer)
    owner = db.Column(db.String(80), nullable=True)
    comment = db.Column(db.String(80), nullable=True)
    datacenter_name = db.Column(db.String(80))
    network_connections = db.Column(pg.JSON, nullable=True)
    power_connections = db.Column(pg.ARRAY(db.String(50)), nullable=True)
    asset_number = db.Column(db.Integer)

    decommission_user = db.Column(db.String(80))
    timestamp = db.Column(db.String(120))
    network_neighborhood = db.Column(pg.JSON, nullable=True)

    def __init__(self, decommission: Decommission):
        self.vendor = decommission.vendor
        self.model_number = decommission.model_number
        self.height = decommission.height
        self.hostname = decommission.hostname
        self.rack_label = decommission.rack_label
        self.rack_position = decommission.rack_position
        self.owner = decommission.owner
        self.comment = decommission.comment
        self.datacenter_name = decommission.datacenter_name
        self.network_connections = decommission.network_connections
        self.power_connections = decommission.power_connections
        self.asset_number = decommission.asset_number
        self.decommission_user = decommission.decommission_user
        self.timestamp = decommission.timestamp
        self.network_neighborhood = decommission.network_neighborhood

    def make_decommission(self) -> Decommission:
        """ Convert the database entry to an instance """
        return Decommission(
            vendor=self.vendor,
            model_number=self.model_number,
            height=self.height,
            hostname=self.hostname,
            rack_label=self.rack_label,
            rack_position=self.rack_position,
            owner=self.owner,
            comment=self.comment,
            datacenter_name=self.datacenter_name,
            network_connections=self.network_connections,
            power_connections=self.power_connections,
            asset_number=self.asset_number,
            timestamp=self.timestamp,
            decommission_user=self.decommission_user,
            network_neighborhood=self.network_neighborhood,
        )


class DecommissionTable:
    def add_decommission(self, decommission: Decommission):
        decommission_entry: DecommissionEntry = DecommissionEntry(
            decommission=decommission
        )
        print("decommission_entry.timestamp = ", decommission_entry.timestamp)
        try:
            db.session.add(decommission_entry)
            db.session.commit()
        except:
            print(
                f"Failed to save record of decommissioned asset {decommission.asset_number}"
            )

    def get_decommissions_with_filters(
        self, user: Optional[str], start_date: Optional[str], end_date: Optional[str],
    ) -> List[Decommission]:
        """ Get a list of all decommissioned assets containing the given filters """
        conditions = []
        if user is not None and user != "":
            conditions.append(DecommissionEntry.decommission_user.contains(user))
        if start_date is not None and start_date != "":
            conditions.append(DecommissionEntry.timestamp >= start_date)
        if end_date is not None and end_date != "":
            conditions.append(DecommissionEntry.timestamp <= end_date)

        decommissions: List[DecommissionEntry] = DecommissionEntry.query.filter(
            and_(*conditions)
        )

        if decommissions is None:
            return None

        return [entry.make_decommission() for entry in decommissions]
