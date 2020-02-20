from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_validator import InstanceValidator


class InstanceManager:
    def __init__(self):
        self.table = InstanceTable()
        self.model_table = ModelTable()
        self.dc_table = DatacenterTable()
        self.validate = InstanceValidator()

    def create_instance(self, instance_data):
        try:
            try:
                new_instance = self.make_instance(instance_data)
                if type(new_instance) is InvalidInputsError:
                    return new_instance
                print(new_instance)
            except InvalidInputsError as e:
                return e.message
            create_validation_result = "success"
            print(create_validation_result)
            try:
                create_validation_result = self.validate.create_instance_validation(
                    new_instance
                )
            except InvalidInputsError as e:
                return e.message
            if create_validation_result == "success":
                self.table.add_instance(new_instance)
            else:
                return InvalidInputsError(create_validation_result)
        except:
            raise InvalidInputsError(
                "An error occurred when attempting to create the instance."
            )

    def delete_instance(self, instance_data):
        asset_number = self.check_null(instance_data[Constants.ASSET_NUMBER_KEY])

        if asset_number == "":
            raise InvalidInputsError("Must provide an asset number")

        try:
            self.table.delete_instance_by_asset_number(asset_number)
        except:
            raise InvalidInputsError(
                "An error occurred when trying to delete the specified asset."
            )

    def detail_view(self, instance_data):
        print(instance_data)
        asset_number = instance_data.get(Constants.ASSET_NUMBER_KEY)

        try:
            print("Get these things")
            print(asset_number)
            instance = self.table.get_instance_by_asset_number(asset_number)
            return instance
        except:
            raise InvalidInputsError(
                "An error occured while retrieving data for this asset."
            )

    def edit_instance(self, instance_data):
        print("INSTANCE DATA")
        print(instance_data)
        try:
            original_asset_number = instance_data.get(Constants.ASSET_NUMBER_ORIG_KEY)
            if original_asset_number is None:
                raise InvalidInputsError("Unable to find the asset to edit.")

            new_instance = self.make_instance(instance_data)
            edit_validation_result = self.validate.edit_instance_validation(
                new_instance, original_asset_number
            )
        except InvalidInputsError as e:
            return e.message
        if edit_validation_result == "success":
            self.table.edit_instance(new_instance, original_asset_number)
        else:
            return InvalidInputsError(edit_validation_result)

        if type(new_instance) is InvalidInputsError:
            return new_instance

    def get_instances(self, filter, dc_name, limit: int):
        model_name = filter.get("model")

        try:
            if model_name is not None and model_name != "":
                print("MODEL_NAME")
                print(model_name)
                model_id = self.get_model_id_from_name(model_name)
            else:
                model_id = None
        except:
            raise InvalidInputsError(
                "An error occurred while trying to filter by model name. Please input a different model name"
            )

        try:
            if dc_name is not None:
                dc_id = self.get_datacenter_id_from_name(dc_name)
                if dc_id == -1:
                    dc_id = None
        except:
            raise InvalidInputsError(
                "An error occurred while trying to filter by datacenter name. Please input a different model name"
            )

        hostname = filter.get("hostname")
        rack_label = filter.get("rack")
        rack_position = filter.get("rack_position")

        try:
            instance_list = self.table.get_instances_with_filters(
                model_id=model_id,
                hostname=hostname,
                rack_label=rack_label,
                rack_position=rack_position,
                datacenter_id=dc_id,
                limit=limit,
            )
            return instance_list
        except:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve instance data."
            )

    def get_possible_models_with_filters(self, prefix_json):
        try:
            return_list = []
            # prefix = prefix_json.get("input")
            # if prefix is None:
            #     prefix = ""

            model_list = self.model_table.get_all_models()
            for model in model_list:
                model_name = model.vendor + " " + model.model_number
                # if model_name.startswith(prefix):
                return_list.append(model_name)

            return return_list
        except:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve model options."
            )

    def make_instance(self, instance_data):
        print("instance data")
        print(instance_data)
        model_name = self.check_null(instance_data[Constants.MODEL_KEY])
        model_id = self.get_model_id_from_name(model_name)

        datacenter_name = self.check_null(instance_data[Constants.DATACENTER_KEY])
        datacenter_id = self.get_datacenter_id_from_name(datacenter_name)

        try:
            hostname = self.check_null(instance_data[Constants.HOSTNAME_KEY])
            rack = self.check_null(instance_data[Constants.RACK_KEY].upper())
            rack_position = self.check_null(instance_data[Constants.RACK_POSITION_KEY])
            owner = self.check_null(instance_data[Constants.OWNER_KEY])
            comment = self.check_null(instance_data[Constants.COMMENT_KEY])
            mac_address = self.check_null(instance_data[Constants.MAC_ADDRESS_KEY])
            network_connections = self.check_null(
                instance_data[Constants.NETWORK_CONNECTIONS_KEY]
            )
            power_connections = self.check_null(
                instance_data[Constants.POWER_CONNECTIONS_KEY]
            )
            asset_number = self.check_null(instance_data[Constants.ASSET_NUMBER_KEY])
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        if rack == "":
            return InvalidInputsError("Must provide a rack location")
        if rack_position == "":
            return InvalidInputsError("Must provide a rack location")
        if asset_number == "":
            return InvalidInputsError("Must provide an asset number")

        print("about to make instance")
        return Instance(
            model_id,
            hostname,
            rack,
            rack_position,
            owner,
            comment,
            datacenter_id,
            mac_address,
            network_connections,
            power_connections,
            asset_number,
        )

    def get_model_id_from_name(self, model_name):
        try:
            model_list = self.model_table.get_all_models()
            print("MODEL_LIST")
            print(model_list)
            for model in model_list:
                if model.vendor + " " + model.model_number == model_name:
                    print("FOUND MATCH")
                    model_id = self.model_table.get_model_id_by_vendor_number(
                        model.vendor, model.model_number
                    )
                    if model_id is None:
                        print("MODEL_ID = -1")
                        # raise InvalidInputsError("Invalid model name.")
                        model_id = -1

                    print("MODEL_ID")
                    print(model_id)
                    return model_id
            return -1
        except:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve model info corresponding to the instance."
            )

    def get_datacenter_id_from_name(self, datacenter_name):
        try:
            datacenter_id = self.dc_table.get_datacenter_id_by_name(datacenter_name)
            if datacenter_id is None:
                return -1
            return datacenter_id
        except:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve datacenter info corresponding to the instance."
            )

    def get_model_from_id(self, model_id):
        model = self.model_table.get_model(model_id)
        if model is None:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve model info corresponding to the instance."
            )

        return model

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
