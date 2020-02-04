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
            print("making model")
            print("model data")
            print(model_data)
            new_model = self.make_model(model_data)
            create_validation_result = self.validate.create_model_validation(new_model)
            if create_validation_result == "success":
                print("made model")
                self.table.add_model(new_model)
                print("model added to table")
            else:
                raise InvalidInputsError(create_validation_result)
        except:
            raise InvalidInputsError("Unable to add the new model")

    def delete_model(self, model_data):
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["model_number"])

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
            if delete_validation_result == "success":
                print("Validation successful")
                self.table.delete_model_str(vendor, model_number)
                print("Successfully deleted from ModelTable")
            else:
                print("Validation unsuccessful")
                return InvalidInputsError(delete_validation_result)
        except:
            print("SOMETHING BAD HAPPENED")
            return InvalidInputsError(
                "An error occured while trying to delete the model."
            )

    def detail_view(self, model_data):
        print("model data")
        print(model_data)
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["model_number"])

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
            original_vendor = self.check_null(model_data.get("vendorOriginal"))
            original_model_number = self.check_null(
                model_data.get("model_numberOriginal")
            )
            original_height = self.check_null(model_data.get("heightOriginal"))

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
            self.table.edit_model(model_id, updated_model)
        except:
            raise InvalidInputsError(
                "A failure occured while trying to edit the model."
            )

    def get_models(self, filter, limit: int):
        vendor = filter.get("vendor")
        model_number = filter.get("model_number")
        height = filter.get("height")

        try:
            model_list = self.table.get_models_with_filter(
                vendor=vendor, model_number=model_number, height=height, limit=limit
            )
            return model_list
        except:
            raise InvalidInputsError(
                "A failure occured while searching with the given filters."
            )

    def get_distinct_vendors_with_prefix(self, prefix_json):
        try:
            return_list = []
            # prefix = prefix_json.get("input")
            # if prefix is None:
            #     prefix = ""

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
            print("getting values")
            vendor = self.check_null(model_data.get("vendor"))
            print(vendor)
            model_number = self.check_null(model_data.get("model_number"))
            print(model_number)
            height = int(self.check_null(model_data.get("height")))
            print(height)
            display_color = self.check_null(model_data.get("display_color"))
            print(display_color)
            ethernet_ports = self.check_null(model_data.get("ethernet_ports"))
            print(ethernet_ports)
            try:
                ethernet_ports = int(ethernet_ports)
            except:
                ethernet_ports = None
            pow_ports = self.check_null(model_data.get("power_ports"))
            print(pow_ports)
            try:
                pow_ports = int(pow_ports)
            except:
                pow_ports = None
            cpu = self.check_null(model_data.get("cpu"))
            print(cpu)
            memory = self.check_null(model_data.get("memory"))
            print(memory)
            try:
                memory = int(memory)
            except:
                memory = None
            storage = self.check_null(model_data.get("storage"))
            print(storage)
            comment = self.check_null(model_data.get("comment"))
            print(comment)

            print("got values")
        except:
            raise InvalidInputsError(
                "Could not read data fields correctly. Client-server error occurred."
            )

        print("checking inputs")
        if vendor == "":
            raise InvalidInputsError("Must provide a vendor")
        if model_number == "":
            raise InvalidInputsError("Must provide a model number")
        if height == "":
            raise InvalidInputsError("Must provide a height")

        print("inputs validated")
        return Model(
            vendor=vendor,
            model_number=model_number,
            height=height,
            display_color=display_color,
            ethernet_ports=ethernet_ports,
            power_ports=pow_ports,
            cpu=cpu,
            memory=memory,
            storage=storage,
            comment=comment,
        )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
