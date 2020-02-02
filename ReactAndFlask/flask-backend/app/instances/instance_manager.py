from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_validator import InstanceValidator


class InstanceManager:
    def __init__(self):
        self.table = InstanceTable()
        self.model_table = ModelTable()
        self.validate = InstanceValidator()

    def create_instance(self, instance_data):
        try:
            new_instance = self.make_instance(instance_data)
            print(new_instance)
            create_validation_result = "success"
            print(create_validation_result)
            create_validation_result = self.validate.create_instance_validation(
                new_instance
            )
            if create_validation_result == "success":
                self.table.add_instance(new_instance)
            else:
                raise InvalidInputsError(create_validation_result)
        except:
            raise InvalidInputsError("failure")

    def delete_instance(self, instance_data):
        rack = self.check_null(instance_data["rack"])
        rack_u = self.check_null(instance_data["rackU"])

        if rack == "":
            raise InvalidInputsError("Must provide a vendor")
        if rack_u == "":
            raise InvalidInputsError("Must provide a model number")

        try:
            self.table.delete_instance_by_rack_location(rack, rack_u)
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
            self.table.edit_instance(new_instance)
        except:
            raise InvalidInputsError("failure")

    def get_instances(self, filter, limit: int):
        model_name = filter.get("model")
        if model_name is not None:
            model_id = self.get_model_id_from_name(model_name)
        else:
            model_id = None

        hostname = filter.get("hostname")
        rack_label = filter.get("rack")
        rack_u = filter.get("rackU")

        try:
            instance_list = self.table.get_instances_with_filters(
                model_id=model_id,
                hostname=hostname,
                rack_label=rack_label,
                rack_u=rack_u,
                limit=limit,
            )
            return instance_list
        except:
            return "error"

    def get_possible_models_with_filters(self, prefix_json):
        return_list = []
        prefix = prefix_json.get("input")
        if prefix is None:
            prefix = ""

        model_list = self.model_table.get_all_models()
        for model in model_list:
            model_name = model.vendor + " " + model.model_number
            if model_name.startswith(prefix):
                return_list.append(model_name)

        return return_list

    def make_instance(self, instance_data):
        model_name = self.check_null(instance_data["model"])
        model_id = self.get_model_id_from_name(model_name)

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

        print("about to make instance")
        return Instance(model_id, hostname, rack, rack_u, owner, comment)

    def get_model_id_from_name(self, model_name):
        data = model_name.split()
        if len(data) != 2:
            return "Invalid Model"

        vendor = data[0]
        model_number = data[1]

        model_id = self.model_table.get_model_id_by_vendor_number(vendor, model_number)
        if model_id is None:
            return "Invalid Model"

        return model_id

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
