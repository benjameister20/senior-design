from app.dal.model_table import ModelTable


class ModelValidator:
    def __init__(self):
        self.table = ModelTable()

    def create_model_validation(self, model):
        result = self.table.get_model_id_by_vendor_number(
            model.vendor, model.model_number
        )
        if result is not None:
            return "This vendor and model number combination already exists."
        else:
            return "success"
