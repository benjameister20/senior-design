from typing import List, Optional, Tuple

from app.dal.database import DBWriteException, db
from app.data_models.model import Model
from app.main.types import JSON
from sqlalchemy import and_
from sqlalchemy.dialects import postgresql as pg


class ModelEntry(db.Model):
    __tablename__ = "models"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    vendor = db.Column(db.String(80))
    model_number = db.Column(db.String(80))
    height = db.Column(db.Integer)
    display_color = db.Column(db.String(80), nullable=True)
    ethernet_ports = db.Column(pg.ARRAY(db.String(80)), nullable=True)
    power_ports = db.Column(db.Integer, nullable=True)
    cpu = db.Column(db.String(80), nullable=True)
    memory = db.Column(db.Integer, nullable=True)
    storage = db.Column(db.String(80), nullable=True)
    comment = db.Column(db.String(80), nullable=True)

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

    def make_model(self) -> Model:
        return Model(
            vendor=self.vendor,
            model_number=self.model_number,
            height=self.height,
            ethernet_ports=self.ethernet_ports,
            power_ports=self.power_ports,
            cpu=self.cpu,
            memory=self.memory,
            storage=self.storage,
            comment=self.comment,
            display_color=self.display_color,
        )


class ModelTable:
    def get_model(self, identifier: int) -> Optional[Model]:
        """ Get the model for the given id """
        model: ModelEntry = ModelEntry.query.filter_by(identifier=identifier).first()
        if model is None:
            return None

        return model.make_model()

    def get_model_by_vendor_number(self, vendor: str, model_number: str):
        model: ModelEntry = ModelEntry.query.filter_by(
            vendor=vendor, model_number=model_number
        ).first()
        if model is None:
            return None

        return model.make_model()

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

        try:
            db.session.add(model_entry)
            db.session.commit()
        except:
            raise DBWriteException(
                message=f"Failed to add model {model.vendor} {model.model_number}"
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
                message=f"Failed to udpate model {model.vendor} {model.model_number}"
            )

    def add_or_update(self, model: Model) -> Tuple[int, int, int]:
        """" Adds a model or updates it if it already exists """
        model_entry: ModelEntry = ModelEntry(model=model)

        try:
            result: ModelEntry = ModelEntry.query.filter_by(
                vendor=model.vendor, model_number=model.model_number
            ).first()

            add, update, ignore = False, False, False
            if result is not None:
                if result.make_model() == model:
                    ignore = True
                else:
                    ModelEntry.query.filter_by(
                        vendor=model.vendor, model_number=model.model_number
                    ).update(values=model_entry.make_json())
                    update = True
            else:
                db.session.add(model_entry)
                add = True

            db.session.commit()

            return int(add), int(update), int(ignore)
        except:
            raise DBWriteException(
                message=f"Failed to udpate model {model.vendor} {model.model_number}"
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
                message=f"Failed to add model {model.vendor} {model.model_number}"
            )

    def delete_model_str(self, vendor: str, model_num: str) -> None:
        """ Removes a model from the database """
        try:
            ModelEntry.query.filter_by(vendor=vendor, model_number=model_num).delete()
            db.session.commit()
        except:
            raise DBWriteException(message=f"Failed to add model {vendor} {model_num}")

    def get_all_models(self) -> List[Model]:
        """ Get a list of all models """
        all_models: List[ModelEntry] = ModelEntry.query.all()

        return [model.make_model() for model in all_models]

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

        return [model.make_model() for model in filtered_models]

    def get_distinct_vendors(self):
        model_list: List[ModelEntry] = ModelEntry.query.with_entities(
            ModelEntry.vendor
        ).distinct().all()
        return [model.vendor for model in model_list]
