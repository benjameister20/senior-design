from app.constants import Constants
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.data_models.model import Model
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.models.model_validator import ModelValidator


class ModelManager:
    def __init__(self):
        self.table = ModelTable()
        self.instance_table = InstanceTable()
        self.validate = ModelValidator()

    def create_model(self, model_data):
        try:
            new_model: Model = self.make_model(model_data)
            create_validation_result = self.validate.create_model_validation(new_model)
            if create_validation_result == Constants.API_SUCCESS:
                self.table.add_model(new_model)
            else:
                raise InvalidInputsError(create_validation_result)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)
        except:
            raise InvalidInputsError("Unable to add the new model")

    def delete_model(self, model_data):
        vendor = self.check_null(model_data[Constants.VENDOR_KEY])
        model_number = self.check_null(model_data[Constants.MODEL_NUMBER_KEY])

        print("Got vendor and model_number")

        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")

        print("Vendor and Model not blank")

        try:
            delete_validation_result = self.validate.delete_model_validation(
                vendor, model_number
            )
            print("Validation complete")
            print(delete_validation_result)
            if delete_validation_result == Constants.API_SUCCESS:
                print("Validation successful")
                self.table.delete_model_str(vendor, model_number)
                print("Successfully deleted from ModelTable")
            else:
                print("Validation unsuccessful")
                return InvalidInputsError(delete_validation_result)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)
        except:
            print("SOMETHING BAD HAPPENED")
            return InvalidInputsError(
                "An error occured while trying to delete the model."
            )

    def detail_view(self, model_data):
        print("model data")
        print(model_data)
        vendor = self.check_null(model_data[Constants.VENDOR_KEY])
        model_number = self.check_null(model_data[Constants.MODEL_NUMBER_KEY])

        try:
            model = self.table.get_model_by_vendor_number(vendor, model_number)
            return model
        except:
            raise InvalidInputsError(
                "An error occured while trying to retrieve the model data."
            )

    def edit_model(self, model_data):
        try:
            updated_model = self.make_model(model_data)
            original_vendor = self.check_null(model_data.get(Constants.VENDOR_ORIG_KEY))
            original_model_number = self.check_null(
                model_data.get(Constants.MODEL_NUMBER_ORIG_KEY)
            )
            original_height = self.check_null(model_data.get(Constants.HEIGHT_ORIG_KEY))

            model_id = self.table.get_model_id_by_vendor_number(
                original_vendor, original_model_number
            )
            if original_height != updated_model.height:
                if model_id is None:
                    return InvalidInputsError("Model not found")
                deployed_instances = self.instance_table.get_instances_by_model_id(
                    model_id
                )
                if deployed_instances is not None:
                    return InvalidInputsError(
                        "Cannot edit height while instances are deployed"
                    )
            edit_validation_result = self.validate.edit_model_validation(
                self.make_model(model_data), original_vendor, original_model_number
            )
            if edit_validation_result == Constants.API_SUCCESS:
                self.table.edit_model(model_id, updated_model)
            else:
                return InvalidInputsError(edit_validation_result)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)
        except:
            raise InvalidInputsError(
                "A failure occured while trying to edit the model."
            )

    def get_models(self, filter, limit: int):
        vendor = filter.get(Constants.VENDOR_KEY)
        model_number = filter.get(Constants.MODEL_NUMBER_KEY)
        height = filter.get(Constants.HEIGHT_KEY)

        try:
            model_list = self.table.get_models_with_filter(
                vendor=vendor, model_number=model_number, height=height, limit=limit
            )
            return model_list
        except:
            raise
            raise InvalidInputsError(
                "A failure occured while searching with the given filters."
            )

    def get_distinct_vendors_with_prefix(self, prefix_json):
        try:
            return_list = []

            vendor_list = self.table.get_distinct_vendors()
            for vendor in vendor_list:
                # if vendor.startswith(prefix):
                return_list.append(vendor)

            return return_list
        except:
            raise InvalidInputsError(
                "An error occurred when trying to load previous vendors."
            )

    def make_model(self, model_data):
        try:
            return Model.from_json(json=model_data)
        except:
            raise

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
