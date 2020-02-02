from typing import List, Optional

from app.dal.database import db
from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.data_models.model import Model
from sqlalchemy import and_


class ModelEntry(db.Model):
    __tablename__ = "models"

    identifier = db.Column(db.Integer, primary_key=True, unique=True)
    vendor = db.Column(db.String(80))
    model_number = db.Column(db.String(80))
    height = db.Column(db.Integer)
    eth_ports = db.Column(db.Integer)
    power_ports = db.Column(db.Integer)
    cpu = db.Column(db.String(80))
    memory = db.Column(db.Integer)
    storage = db.Column(db.String(80))
    comment = db.Column(db.String(80))
    display_color = db.Column(db.String(80))

    def __init__(self, model: Model):
        self.vendor = model.vendor
        self.model_number = model.model_number
        self.height = model.height
        self.eth_ports = model.eth_ports
        self.power_ports = model.power_ports
        self.cpu = model.cpu
        self.memory = model.memory
        self.storage = model.storage
        self.comment = model.comment
        self.display_color = model.display_color


class ModelTable:
    def get_model(self, identifier: int) -> Optional[Model]:
        """ Get the model for the given id """
        model: ModelEntry = ModelEntry.query.filter_by(identifier=identifier).model()
        if model is None:
            return None

        return Model(
            vendor=model.vendor,
            model_number=model.model_number,
            height=model.height,
            eth_ports=model.eth_ports,
            power_ports=model.power_ports,
            cpu=model.cpu,
            memory=model.memory,
            storage=model.storage,
            comment=model.comment,
            display_color=model.display_color,
        )

    def get_model_by_vendor_number(self, vendor, model_number):
        model: ModelEntry = ModelEntry.query.filter_by(
            vendor=vendor, model_number=model_number
        ).first()
        if model is None:
            return None

        return Model(
            vendor=model.vendor,
            model_number=model.model_number,
            height=model.height,
            eth_ports=model.eth_ports,
            power_ports=model.power_ports,
            cpu=model.cpu,
            memory=model.memory,
            storage=model.storage,
            comment=model.comment,
            display_color=model.display_color,
        )

    def get_model_id_by_vendor_number(self, vendor, model_number):
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
            raise ChangeModelDBException(
                "Failed to add model {model.vendor} {model.model_number}"
            )

    def edit_model(self, model_id, model: Model) -> None:
        """ Updates a model to the database """

        # model_entry: ModelEntry = ModelEntry(model=model)

        try:
            # ModelEntry.query.filter_by(identifier=model_id).update(model_entry)
            old_entry = ModelEntry.query.filter_by(identifier=model_id).first()
            old_entry.vendor = model.vendor
            old_entry.model_number = model.model_number
            old_entry.height = model.height
            old_entry.eth_ports = model.eth_ports
            old_entry.power_ports = model.power_ports
            old_entry.cpu = model.cpu
            old_entry.memory = model.memory
            old_entry.storage = model.storage
            old_entry.comment = model.comment
            old_entry.display_color = model.display_color
            db.session.commit()
        except:
            raise ChangeModelDBException(
                f"Failed to udpate model {model.vendor} {model.model_number}"
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
            raise ChangeModelDBException(
                "Failed to add model {model.vendor} {model.model_number}"
            )

    def delete_model_str(self, vendor: str, model_num: str) -> None:
        """ Removes a model from the database """
        try:
            ModelEntry.query.filter_by(vendor=vendor, model_number=model_num).delete()
            db.session.commit()
        except:
            raise ChangeModelDBException("Failed to add model {vendor} {model_number}")

    def get_all_models(self) -> List[Model]:
        """ Get a list of all models """
        all_models: List[ModelEntry] = ModelEntry.query.all()

        return [
            Model(
                vendor=model.vendor,
                model_number=model.model_number,
                height=model.height,
                eth_ports=model.eth_ports,
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
                eth_ports=model.eth_ports,
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
