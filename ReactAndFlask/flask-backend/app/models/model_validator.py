import re

from app.constants import Constants
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.data_models.model import Model


class ModelValidator:
    def __init__(self):
        self.model_table = ModelTable()
        self.instance_table = InstanceTable()

    def _validate(self, model: Model) -> str:
        pattern = re.compile("[0-9]+")
        if pattern.fullmatch(str(model.height)) is None:
            return "The value for model height must be a positive integer."

        if model.ethernet_ports is not None:
            port_pattern = re.compile("[a-zA-Z0-9]+")
            for port_name in model.ethernet_ports:
                if port_pattern.fullmatch(port_name) is None:
                    return "Network port names must not have spaces and only contain letters and numbers"
                if len(port_name) > 20:
                    return "Network port names must be shorter than 20 characters."

        if (
            model.power_ports != ""
            and model.power_ports != None
            and pattern.fullmatch(str(model.power_ports)) is None
        ):
            return "The value for power ports must be a positive integer."
        if (
            model.memory != ""
            and model.memory != None
            and pattern.fullmatch(str(model.memory)) is None
        ):
            return "The value for memory must be a positive integer in terms of GB."

        return Constants.API_SUCCESS

    def create_model_validation(self, model: Model) -> str:
        result = self.model_table.get_model_id_by_vendor_number(
            model.vendor, model.model_number
        )

        if result is not None:
            return "This vendor and model number combination already exists."

        return self._validate(model=model)

    def edit_model_validation(
        self, model: Model, original_vendor: str, original_model_number: str
    ) -> str:
        if not (
            original_vendor == model.vendor
            and original_model_number == model.model_number
        ):
            result = self.model_table.get_model_id_by_vendor_number(
                model.vendor, model.model_number
            )

            if result is not None:
                return "This vendor and model number combination already exists."

        return self._validate(model=model)

    def delete_model_validation(self, vendor, model_number):
        model_id = self.model_table.get_model_id_by_vendor_number(vendor, model_number)
        print("MODEL_ID")
        print(model_id)
        if self.instance_table.get_instances_by_model_id(model_id) is None:
            return Constants.API_SUCCESS
        else:
            result = "There are still existing instances for this model. "
            result += "Please delete them before deleting the model."
            return result
