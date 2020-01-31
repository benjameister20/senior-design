from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable


class InstanceValidator:
    def __init__(self):
        self.instance_table = InstanceTable()
        self.model_table = ModelTable()
        self.rack_table = RackTable()
        self.rack_height = 42

    def create_instance_validation(self, instance):
        if self.rack_table.get_rack(instance.rack_label) is None:
            return "The requested rack does not exist. Instances must be created on preexisting racks"

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        instance_bottom = instance.rack_u
        instance_top = instance.rack_u + model_template.height - 1

        if instance_top > self.rack_height:
            return "The placement of the instance exceeds the height of the rack."

        instance_list = self.instance_table.get_instances_by_rack(instance.rack_label)
        if instance_list is None:
            return "success"

        for current_instance in instance_list:
            model = self.model_table.get_model(instance.model_id)
            current_instance_top = current_instance.rack_u + model.height - 1
            if (
                current_instance.rack_u >= instance_bottom
                and current_instance.rack_u <= instance_top
            ):
                return self.return_conflict(current_instance)
            elif (
                current_instance_top >= instance_bottom
                and current_instance_top <= instance_top
            ):
                return self.return_conflict(current_instance)

        return "success"

    def return_conflict(self, current_instance):
        result = f"The instance placement conflicts with instance with hostname {current_instance.hostname} "
        result += f"on rack {current_instance.rack_label} at height U{current_instance.rack_u}."
        return result
