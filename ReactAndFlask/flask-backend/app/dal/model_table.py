from typing import List, Optional

from app.dal.database import db
from app.data_models.model import Model


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

    def add_model(self, model: Model) -> None:
        """ Adds a model to the database """
        model_entry: ModelEntry = ModelEntry(model=model)

        try:
            db.session.add(model_entry)
            db.session.commit()
        except:
            print(f"Failed to add model {model.vendor} {model.model_number}")

    def delete_model(self, model: Model) -> None:
        """ Removes a model from the database """
        try:
            ModelEntry.query.filter_by(
                vendor=model.vendor, model_number=model.model_number
            ).delete()
            db.session.commit()
        except:
            print(f"Failed to delete model {model.vendor} {model.model_number}")

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
