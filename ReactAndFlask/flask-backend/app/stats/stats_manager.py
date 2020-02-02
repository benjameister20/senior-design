import json

from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable


class StatsManager:
    def __init__(self):
        self.instance_table = InstanceTable()
        self.model_table = ModelTable()
        self.rack_table = RackTable()

        self.space_by_rack = {}
        self.space_by_vendor = {}
        self.space_by_model = {}
        self.space_by_owner = {}
        self.rack_height = 42

    def create_report(self):
        rack_list = self.rack_table.get_all_racks()
        num_racks = len(rack_list)

        for rack in rack_list:
            instance_list = self.instance_table.get_instances_by_rack(rack.label)
            self.iterate_instance(instance_list, rack.label)

        total_space_used = 0
        for key in self.space_by_rack:
            total_space_used += self.space_by_rack[key]
            self.space_by_rack[key] = round(
                (self.space_by_rack[key] / self.rack_height) * 100, 2
            )

        percent_total_used = round(
            (total_space_used / (num_racks * self.rack_height)) * 100, 2
        )

        self.space_by_vendor = self.divide_dict_by_space_used(
            self.space_by_vendor, total_space_used
        )
        self.space_by_model = self.divide_dict_by_space_used(
            self.space_by_model, total_space_used
        )
        self.space_by_owner = self.divide_dict_by_space_used(
            self.space_by_owner, total_space_used
        )

        rack_usage_json = json.dumps(self.space_by_rack, sort_keys=True)
        vendor_usage_json = json.dumps(self.space_by_vendor, sort_keys=True)
        model_usage_json = json.dumps(self.space_by_model, sort_keys=True)
        owner_usage_json = json.dumps(self.space_by_owner, sort_keys=True)

        returnJSON = {
            "totalUsage": percent_total_used,
            "spaceUsage": rack_usage_json,
            "vendorUsage": vendor_usage_json,
            "modelUsage": model_usage_json,
            "ownerUsage": owner_usage_json,
        }

        return returnJSON

    def iterate_instance(self, instance_list, rack_label):
        rack_space_used = 0
        for instance in instance_list:
            model = self.model_table.get_model(instance.model_id)
            rack_space_used += model.height

            if model.vendor in self.space_by_vendor:
                self.space_by_vendor[model.vendor] += model.height
            else:
                self.space_by_vendor[model.vendor] = model.height

            model_name = model.vendor + " " + model.model_number
            if model_name in self.space_by_model:
                self.space_by_model[model_name] += model.height
            else:
                self.space_by_model[model_name] = model.height

            if instance.owner is None or instance.owner == "":
                owner = "No owner listed"
            else:
                owner = instance.owner
            if owner in self.space_by_owner:
                self.space_by_owner[owner] += model.height
            else:
                self.space_by_owner[owner] = model.height

        self.space_by_rack[rack_label] = rack_space_used

    def divide_dict_by_space_used(self, dictionary, total_space_used):
        for key in dictionary:
            dictionary[key] = round((dictionary[key] / total_space_used) * 100, 2)

        return dictionary
