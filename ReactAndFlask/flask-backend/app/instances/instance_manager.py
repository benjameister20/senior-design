from app.dal.instance_table import InstanceEntry, InstanceTable
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError


class InstanceManager:
    def __init__(self):
        self.table = InstanceTable()

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
            # TODO split rack letter and number
            self.table.delete_instance_by_rack_location(rack, rack, rack_u)
        # TODO change exception
        except:
            raise InvalidInputsError("Error adding model")

    def view(self):
        return "test"

    def detail_view(self, instance_data):
        self.check_null(instance_data["rack"])
        self.check_null(instance_data["rackU"])

        return "test"

    def make_instance(self, instance_data):
        self.check_null(instance_data["model"])

        # TODO convert to model id
        model_id = 1

        hostname = self.check_null(instance_data["hostname"])
        rack = self.check_null(instance_data["rack"])
        rack_u = self.check_null(instance_data["rackU"])
        owner = self.check_null(instance_data["owner"])
        comment = self.check_null(instance_data["comment"])

        return Instance(model_id, hostname, rack, rack_u, owner, comment)

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
