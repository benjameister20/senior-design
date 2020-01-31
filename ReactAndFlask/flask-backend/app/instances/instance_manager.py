from app.dal.instance_table import InstanceEntry, InstanceTable
from app.dal.model_table import ModelEntry, ModelTable
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError


class InstanceManager:
    def __init__(self):
        self.table = InstanceTable()
        self.model_table = ModelTable()

    def create_instance(self, instance_data):
        # TODO add validation

        try:
            new_instance = self.make_instance(instance_data)
            self.table.add_instance(InstanceEntry(new_instance))
        except:
            raise InvalidInputsError("failure")

    def delete_instance(self, instance_data):
        rack = self.check_null(instance_data["rack"])
        rack_u = self.check_null(instance_data["rackU"])

        if rack == "":
            raise InvalidInputsError("Must provide a vendor")
        if rack_u == "":
            raise InvalidInputsError("Must provide a model number")

        # TODO add validation

        try:
            self.table.delete_instance_by_rack_location(rack, rack_u)
        # TODO change exception
        except:
            raise InvalidInputsError("Error adding model")

    def detail_view(self, instance_data):
        rack = self.check_null(instance_data["rack"])
        rack_u = self.check_null(instance_data["rackU"])

        try:
            instance = self.table.get_instance_by_rack_location(rack, rack_u)
            return instance
        except:
            return "error"

    def edit_instance(self, instance_data):
        try:
            new_instance = self.make_instance(instance_data)
            self.table.edit_instance(ModelEntry(new_instance))
        except:
            raise InvalidInputsError("failure")

    def get_instances(self, fitler: str, limit: int):
        return ""

    def make_instance(self, instance_data):
        model_name = self.check_null(instance_data["model"])
        data = model_name.split()
        if len(data) != 2:
            return "Invalid Model"

        vendor = data[0]
        model_number = data[1]

        model_id = self.model_table.get_model_id_by_vendor_number(vendor, model_number)
        if model_id is None:
            return "Invalid Model"

        try:
            hostname = self.check_null(instance_data["hostname"])
            rack = self.check_null(instance_data["rack"])
            rack_u = self.check_null(instance_data["rackU"])
            owner = self.check_null(instance_data["owner"])
            comment = self.check_null(instance_data["comment"])
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        if hostname == "":
            raise InvalidInputsError("Must provide a hostname")
        if rack == "":
            raise InvalidInputsError("Must provide a rack location")
        if rack_u == "":
            raise InvalidInputsError("Must provide a rack location")

        return Instance(model_id, hostname, rack, rack_u, owner, comment)

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
