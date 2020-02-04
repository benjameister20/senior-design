from typing import List, Optional

from app.dal.database import DBWriteException, db
from app.data_models.model import Model
from app.main.types import JSON
from sqlalchemy import and_


class ModelEntry(db.Model):
    __tablename__ = "models"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    vendor = db.Column(db.String(80))
    model_number = db.Column(db.String(80))
    height = db.Column(db.Integer)
    display_color = db.Column(db.String(80))
    ethernet_ports = db.Column(db.Integer)
    power_ports = db.Column(db.Integer)
    cpu = db.Column(db.String(80))
    memory = db.Column(db.Integer)
    storage = db.Column(db.String(80))
    comment = db.Column(db.String(80))

    def __init__(self, model: Model):
        self.vendor = model.vendor
        self.model_number = model.model_number
        self.height = model.height
        self.display_color = model.display_color
        self.ethernet_ports = model.ethernet_ports
        self.power_ports = model.power_ports
        self.cpu = model.cpu
        self.memory = model.memory
        self.storage = model.storage
        self.comment = model.comment

    def make_json(self) -> JSON:
        return {
            "vendor": self.vendor,
            "model_number": self.model_number,
            "height": self.height,
            "display_color": self.display_color,
            "ethernet_ports": self.ethernet_ports,
            "power_ports": self.power_ports,
            "cpu": self.cpu,
            "memory": self.memory,
            "storage": self.storage,
            "comment": self.comment,
        }


class ModelTable:
    def get_model(self, identifier: int) -> Optional[Model]:
        """ Get the model for the given id """
        model: ModelEntry = ModelEntry.query.filter_by(identifier=identifier).first()
        if model is None:
            return None

        return Model(
            vendor=model.vendor,
            model_number=model.model_number,
            height=model.height,
            ethernet_ports=model.ethernet_ports,
            power_ports=model.power_ports,
            cpu=model.cpu,
            memory=model.memory,
            storage=model.storage,
            comment=model.comment,
            display_color=model.display_color,
        )

    def get_model_by_vendor_number(self, vendor: str, model_number: str):
        model: ModelEntry = ModelEntry.query.filter_by(
            vendor=vendor, model_number=model_number
        ).first()
        if model is None:
            return None

        return Model(
            vendor=model.vendor,
            model_number=model.model_number,
            height=model.height,
            ethernet_ports=model.ethernet_ports,
            power_ports=model.power_ports,
            cpu=model.cpu,
            memory=model.memory,
            storage=model.storage,
            comment=model.comment,
            display_color=model.display_color,
        )

    def get_model_id_by_vendor_number(
        self, vendor: str, model_number: str
    ) -> Optional[int]:
        model: ModelEntry = ModelEntry.query.filter_by(
            vendor=vendor, model_number=model_number
        ).first()
        if model is None:
            return None

        return model.identifier

    def add_model(self, model: Model) -> None:
        """ Adds a model to the database """
        model_entry: ModelEntry = ModelEntry(model=model)
        print("adding model")
        try:
            db.session.add(model_entry)
            db.session.commit()
        except:
            raise DBWriteException(
                message="Failed to add model {model.vendor} {model.model_number}"
            )

    def edit_model(self, model_id: str, model: Model) -> None:
        """ Updates a model to the database """
        model_entry: ModelEntry = ModelEntry(model=model)

        try:
            ModelEntry.query.filter_by(identifier=model_id).update(
                values=model_entry.make_json()
            )
            db.session.commit()
        except:
            raise DBWriteException(
                message="Failed to udpate model {model.vendor} {model.model_number}"
            )

    def add_or_update(self, model: Model) -> None:
        """" Adds a model or updates it if it already exists """
        model_entry: ModelEntry = ModelEntry(model=model)

        try:
            result: ModelEntry = ModelEntry.query.filter_by(
                vendor=model.vendor, model_number=model.model_number
            ).first()

            if result is not None:
                ModelEntry.query.filter_by(
                    vendor=model.vendor, model_number=model.model_number
                ).update(values=model_entry.make_json())
            else:
                db.session.add(model_entry)

            db.session.commit()
        except:
            raise DBWriteException(
                message="Failed to udpate model {model.vendor} {model.model_number}"
            )

    @DeprecationWarning
    def delete_model(self, model: Model) -> None:
        """ Removes a model from the database """
        try:
            ModelEntry.query.filter_by(
                vendor=model.vendor, model_number=model.model_number
            ).delete()
            db.session.commit()
        except:
            raise DBWriteException(
                message="Failed to add model {model.vendor} {model.model_number}"
            )

    def delete_model_str(self, vendor: str, model_num: str) -> None:
        """ Removes a model from the database """
        try:
            ModelEntry.query.filter_by(vendor=vendor, model_number=model_num).delete()
            db.session.commit()
        except:
            raise DBWriteException(
                message="Failed to add model {vendor} {model_number}"
            )

    def get_all_models(self) -> List[Model]:
        """ Get a list of all models """
        all_models: List[ModelEntry] = ModelEntry.query.all()

        return [
            Model(
                vendor=model.vendor,
                model_number=model.model_number,
                height=model.height,
                ethernet_ports=model.ethernet_ports,
                power_ports=model.power_ports,
                cpu=model.cpu,
                memory=model.memory,
                storage=model.storage,
                comment=model.comment,
                display_color=model.display_color,
            )
            for model in all_models
        ]

    def get_models_with_filter(
        self,
        vendor: Optional[str],
        model_number: Optional[str],
        height: Optional[int],
        limit: int,
    ) -> List[Model]:
        """ Get a list of all models containing the given filter """
        conditions = []
        if vendor is not None and vendor != "":
            conditions.append(ModelEntry.vendor == vendor)
        if model_number is not None and model_number != "":
            conditions.append(ModelEntry.model_number == model_number)
        if height is not None and height != "":
            conditions.append(ModelEntry.height == height)

        filtered_models: List[ModelEntry] = ModelEntry.query.filter(
            and_(*conditions)
        ).limit(limit)

        return [
            Model(
                vendor=model.vendor,
                model_number=model.model_number,
                height=model.height,
                ethernet_ports=model.ethernet_ports,
                power_ports=model.power_ports,
                cpu=model.cpu,
                memory=model.memory,
                storage=model.storage,
                comment=model.comment,
                display_color=model.display_color,
            )
            for model in filtered_models
        ]

    def get_distinct_vendors(self):
        model_list: List[ModelEntry] = ModelEntry.query.with_entities(
            ModelEntry.vendor
        ).distinct().all()
        return [model.vendor for model in model_list]
