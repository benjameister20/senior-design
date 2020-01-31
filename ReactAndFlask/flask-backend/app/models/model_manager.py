from app.dal.exceptions.ChangeModelDBException import ChangeModelDBException
from app.dal.model_table import ModelEntry, ModelTable
from app.data_models.model import Model
from app.exceptions.InvalidInputsException import InvalidInputsError


class ModelManager:
    def __init__(self):
        self.table = ModelTable()

    def create_model(self, model_data):
        # TODO add validation

        try:
            print("making model")
            new_model = self.make_model(model_data)
            print("made model")
            self.table.add_model(ModelEntry(new_model))
            print("added model to table")
        except ChangeModelDBException:
            raise InvalidInputsError("failure")

    def delete_model(self, model_data):
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["modelNumber"])

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")

        # TODO add validation

        try:
            self.table.delete_model_str(vendor, model_number)
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

    def edit_models(self, model_data):
        try:
            new_model = self.make_model(model_data)
            self.table.edit_model(ModelEntry(new_model))
        except ChangeModelDBException:
            raise InvalidInputsError("failure")

    def get_models(self, fitler: str, limit: int):
        return ""

    def make_model(self, model_data):
        try:
            print("getting values")
            vendor = self.check_null(model_data["vendor"])
            print(vendor)
            model_number = self.check_null(model_data["modelNumber"])
            print(model_number)
            height = self.check_null(model_data["height"])
            print(height)
            display_color = self.check_null(model_data["displayColor"])
            print(display_color)
            eth_ports = self.check_null(model_data["ethernetPorts"])
            print(eth_ports)
            pow_ports = self.check_null(model_data["powerPorts"])
            print(pow_ports)
            cpu = self.check_null(model_data["cpu"])
            print(cpu)
            memory = self.check_null(model_data["memory"])
            print(memory)
            storage = self.check_null(model_data["storage"])
            print(storage)
            comments = self.check_null(model_data["comments"])
            print(comments)

            print("got values")
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        print("checking inputs")
        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")
        if height == "":
            raise InvalidInputsError("Must provide a height")

        print("inputs validated")

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
