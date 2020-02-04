import re

from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.dal.user_table import UserTable


class InstanceValidator:
    def __init__(self):
        self.instance_table = InstanceTable()
        self.model_table = ModelTable()
        self.rack_table = RackTable()
        self.user_table = UserTable()
        self.rack_height = 42

    def create_instance_validation(self, instance):
        if self.rack_table.get_rack(instance.rack_label) is None:
            return "The requested rack does not exist. Instances must be created on preexisting racks"

        duplicate_hostname = self.instance_table.get_instance_by_hostname(
            instance.hostname
        )

        if duplicate_hostname is not None:
            return f"An instance with hostname {duplicate_hostname.hostname} exists at location {duplicate_hostname.rack_label} U{duplicate_hostname.rack_position}"

        if len(instance.hostname) > 64:
            return "Hostnames must be 64 characters or less"

        host_pattern = re.compile("[a-zA-Z]+[A-Za-z0-9-]+[A-Za-z0-9]")
        if host_pattern.fullmatch(instance.hostname) is None:
            return "Hostnames must start with a letter, only contain letters, numbers, and hyphens, and end with a letter or number."

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        pattern = re.compile("[0-9]+")
        if pattern.fullmatch(instance.rack_position) is None:
            return "The value for Rack U must be a positive integer."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return "The owner must be an existing user on the system. Please enter the username of an existing user."

        instance_bottom = int(instance.rack_position)
        instance_top = instance_bottom + int(model_template.height) - 1

        if instance_top > self.rack_height:
            return "The placement of the instance exceeds the height of the rack."

        instance_list = self.instance_table.get_instances_by_rack(instance.rack_label)
        if instance_list is None:
            return "success"

        for current_instance in instance_list:
            model = self.model_table.get_model(instance.model_id)
            current_instance_top = current_instance.rack_position + model.height - 1
            if (
                current_instance.rack_position >= instance_bottom
                and current_instance.rack_position <= instance_top
            ):
                return self.return_conflict(current_instance)
            elif (
                current_instance_top >= instance_bottom
                and current_instance_top <= instance_top
            ):
                return self.return_conflict(current_instance)

        return "success"

    def edit_instance_validation(self, instance, original_rack, original_rack_u):
        if self.rack_table.get_rack(instance.rack_label) is None:
            return "The requested rack does not exist. Instances must be created on preexisting racks"

        print("INSTANCE HOSTNAME")
        print(instance.hostname)
        duplicate_hostname = self.instance_table.get_instance_by_hostname(
            instance.hostname
        )

        if duplicate_hostname is not None:
            is_self = (
                duplicate_hostname.rack_label == original_rack
                and duplicate_hostname.rack_u == original_rack_u
            )
            if not is_self:
                return f"An instance with hostname {duplicate_hostname.hostname} exists at location {duplicate_hostname.rack_label} U{duplicate_hostname.rack_u}"

        if len(instance.hostname) > 64:
            return "Hostnames must be 64 characters or less"

        host_pattern = re.compile("[a-zA-Z]+[A-Za-z0-9-]+[A-Za-z0-9]")
        if host_pattern.fullmatch(instance.hostname) is None:
            return "Hostnames must start with a letter, only contain letters, numbers, and hyphens, and end with a letter or number."

        model_template = self.model_table.get_model(instance.model_id)
        if model_template is None:
            return "The model does not exist."

        pattern = re.compile("[0-9]+")
        if pattern.fullmatch(str(instance.rack_u)) is None:
            return "The value for Rack U must be a positive integer."

        if instance.owner != "" and self.user_table.get_user(instance.owner) is None:
            return "The owner must be an existing user on the system. Please enter the username of an existing user."

        instance_bottom = int(instance.rack_u)
        instance_top = instance_bottom + int(model_template.height) - 1

        if instance_top > self.rack_height:
            return "The placement of the instance exceeds the height of the rack."

        instance_list = self.instance_table.get_instances_by_rack(instance.rack_label)
        if instance_list is None:
            return "success"

        for current_instance in instance_list:
            if not (
                current_instance.rack_u == original_rack_u
                and current_instance.rack_label == original_rack
            ):
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
        result += f"on rack {current_instance.rack_label} at height U{current_instance.rack_position}."
        return result
