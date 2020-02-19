from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.data_models.datacenter import Datacenter
from app.exceptions.InvalidInputsException import InvalidInputsError


class DatacenterManager:
    def __init__(self):
        self.dc_table = DatacenterTable()

    def create_datacenter(self, dc_data):
        try:
            try:
                new_datacenter = self.make_datacenter(dc_data)
                if type(new_datacenter) is InvalidInputsError:
                    return new_datacenter
            except InvalidInputsError as e:
                return e.message

            # TODO add validation

            self.dc_table.add_datacenter(new_datacenter)

        except:
            raise InvalidInputsError(
                "An error occurred when attempting to create the instance."
            )

    def delete_datacenter(self, dc_data):
        dc_name = self.check_null(dc_data[Constants.DC_NAME_KEY])

        if dc_name == "":
            raise InvalidInputsError("Must provide a datacenter name to delete")

        try:
            self.dc_table.delete_datacenter_by_name(dc_name)
        except:
            raise InvalidInputsError(
                "An error occurred when trying to delete the specified asset."
            )

    def make_datacenter(self, dc_data):
        try:
            abbreviation = self.check_null(dc_data[Constants.DC_ABRV_KEY])
            name = self.check_null(dc_data[Constants.DC_NAME_KEY])
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        if abbreviation == "":
            return InvalidInputsError("Must provide an abbreviation for the datacenter")
        if name == "":
            return InvalidInputsError("Must provide a datacenter name")

        return Datacenter(abbreviation, name)

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
