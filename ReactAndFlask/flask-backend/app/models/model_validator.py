from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable


class ModelValidator:
    def __init__(self):
        self.model_table = ModelTable()
        self.instance_table = InstanceTable()

    def create_model_validation(self, model):
        result = self.model_table.get_model_id_by_vendor_number(
            model.vendor, model.model_number
        )
        if result is None:
            return "success"
        else:
            return "This vendor and model number combination already exists."

    def delete_model_validation(self, vendor, model_number):
        model_id = self.model_table.get_model_id_by_vendor_number(vendor, model_number)
        if self.instance_table.get_instances_by_model_id(model_id) is None:
            return "success"
        else:
            result = "There are still existing instances for this model. "
            result += "Please delete them before deleting the model."
            return result
