import re

from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.rack_table import RackTable


class DatacenterValidator:
    def __init__(self):
        self.dc_table = DatacenterTable()
        self.rack_table = RackTable()

    def create_dc_validation(self, datacenter):
        if len(datacenter.abbreviation) > 6:
            return "The datacenter abbreviation must be 6 characters or less."

        abbrev_pattern = re.compile("[a-zA-Z]+[a-zA-Z0-9]*")
        if abbrev_pattern.fullmatch(datacenter.abbreviation) is None:
            return "Datacenter abbreviation must start with a letter and only contain letters and numbers."

        name_pattern = re.compile("[a-zA-Z]*[ a-zA-Z0-9-]*[A-Za-z0-9]")
        if name_pattern.fullmatch(datacenter.name) is None:
            return "Datacenter name must start with a letter and only contain letters, numbers, spaces, and hyphens and end in a letter or number."

        if (
            self.dc_table.get_datacenter_id_by_abbrev(datacenter.abbreviation)
            is not None
        ):
            return "A datacenter with the given abbreviation already exists. Please choose a different abbreviation."

        if self.dc_table.get_datacenter_id_by_name(datacenter.name) is not None:
            return "A datacenter with the given name already exists. Please choose a different name."

        return Constants.API_SUCCESS

    def edit_dc_validation(self, datacenter, original_name):
        if len(datacenter.abbreviation) > 6:
            return "The datacenter abbreviation must be 6 characters or less."

        abbrev_pattern = re.compile("[a-zA-Z]+[a-zA-Z0-9]*")
        if abbrev_pattern.fullmatch(datacenter.abbreviation) is None:
            return "Datacenter abbreviation must start with a letter and only contain letters and numbers."

        name_pattern = re.compile("[a-zA-Z]*[ a-zA-Z0-9-]*[A-Za-z0-9]")
        if name_pattern.fullmatch(datacenter.name) is None:
            return "Datacenter name must start with a letter and only contain letters, numbers, spaces, and hyphens and end in a letter or number."

        orig_id = self.dc_table.get_datacenter_id_by_name(original_name)

        abbrev_id = self.dc_table.get_datacenter_id_by_abbrev(datacenter.abbreviation)
        if abbrev_id is not None and abbrev_id != orig_id:
            return "A datacenter with the given abbreviation already exists. Please choose a different abbreviation."

        name_id = self.dc_table.get_datacenter_id_by_name(datacenter.name)
        if name_id is not None and name_id != orig_id:
            return "A datacenter with the given name already exists. Please choose a different name."

        return Constants.API_SUCCESS

    def delete_dc_validation(self, dc_name):
        dc_id = self.dc_table.get_datacenter_id_by_name(dc_name)

        dc_racks = self.rack_table.get_rack_by_datacenter(dc_id)
        if dc_racks is not None and dc_racks != []:
            return (
                "All racks in the datacenter must be removed before it can be deleted."
            )

        return Constants.API_SUCCESS
