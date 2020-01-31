from app.dal.instance_table import InstanceTable


class InstanceValidator:
    def __init__(self):
        self.instance_table = InstanceTable()

    def create_instance_validation(self, instance):
        instance.rack_label
        instance.rack_u
