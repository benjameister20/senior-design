from app.data_models.instance import Instance


class InstanceManager:
    def __init__(self):
        pass

    def create_instance(self, instance_data):
        self.check_null(instance_data["model"])

        # TODO convert to model id
        model_id = 1

        hostname = self.check_null(instance_data["hostname"])
        rack = self.check_null(instance_data["rack"])
        rack_u = self.check_null(instance_data["rackU"])
        owner = self.check_null(instance_data["owner"])
        comment = self.check_null(instance_data["comment"])

        # TODO Add Validation

        Instance(model_id, hostname, rack, rack_u, owner, comment)

        # Add to db

        return "test"

    def delete_instance(self, instance_data):
        self.check_null(instance_data["rack"])
        self.check_null(instance_data["rackU"])

        # Delete from db

        return "test"

    def view(self):
        return "test"

    def detail_view(self, instance_data):
        self.check_null(instance_data["rack"])
        self.check_null(instance_data["rackU"])

        return "test"

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
