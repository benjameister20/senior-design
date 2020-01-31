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
        len(rack_list)

        for rack in rack_list:
            instance_list = self.instance_table.get_instances_by_rack(rack.label)
            self.iterate_instance(instance_list, rack.label)

        # TODO generate report from dictionary objects

        return ""

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
