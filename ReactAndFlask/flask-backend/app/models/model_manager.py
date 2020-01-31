from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.dal.model_table import ModelTable
from app.data_models.model import Model
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.models.model_validator import ModelValidator


class ModelManager:
    def __init__(self):
        self.table = ModelTable()
        self.validate = ModelValidator()

    def create_model(self, model_data):
        try:
            new_model = self.make_model(model_data)
            create_validation_result = self.validate.create_model_validation(new_model)
            if create_validation_result == "success":
                self.table.add_model(new_model)
            else:
                raise InvalidInputsError(create_validation_result)
        except ChangeModelDBException:
            raise InvalidInputsError("failure")

    def delete_model(self, model_data):
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["modelNumber"])

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")

        try:
            delete_validation_result = self.validate.delete_model_validation(
                vendor, model_number
            )
            if delete_validation_result == "success":
                self.table.delete_model_str(vendor, model_number)
            else:
                raise InvalidInputsError(delete_validation_result)
        except ChangeModelDBException:
            raise ChangeModelDBException("Error adding model")

    def detail_view(self, model_data):
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["modelNumber"])

        try:
            model = self.table.get_model_by_vendor_number(vendor, model_number)
            return model
        except ChangeModelDBException:
            return "error"

    def edit_model(self, model_data):
        try:
            updated_model = self.make_model(model_data)
            self.table.edit_model(updated_model)
        except ChangeModelDBException:
            raise InvalidInputsError("failure")

    def get_models(self, filter, limit: int):
        vendor = filter.get("vendor")
        model_number = filter.get("modelNumber")
        height = filter.get("height")
        try:
            model_list = self.table.get_models_with_filter(
                vendor=vendor, model_number=model_number, height=height, limit=limit
            )
            return model_list
        except:
            return "error"

    def make_model(self, model_data):
        try:
            vendor = self.check_null(model_data.get("vendor"))
            model_number = self.check_null(model_data.get("modelNumber"))
            height = self.check_null(model_data.get("height"))
            display_color = self.check_null(model_data.get("displayColor"))
            eth_ports = self.check_null(model_data.get("ethernetPorts"))
            pow_ports = self.check_null(model_data.get("powerPorts"))
            cpu = self.check_null(model_data.get("cpu"))
            memory = self.check_null(model_data.get("memory"))
            storage = self.check_null(model_data.get("storage"))
            comments = self.check_null(model_data.get("comments"))
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")
        if height == "":
            raise InvalidInputsError("Must provide a height")

        return Model(
            vendor,
            model_number,
            height,
            display_color,
            eth_ports,
            pow_ports,
            cpu,
            memory,
            storage,
            comments,
        )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
