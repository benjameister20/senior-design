from app.data_models.model import Model


class ModelManager:
    def __init__(self):
        pass

    def create_model(self, model_data):
        vendor = self.check_null(model_data["vendor"])
        model_number = self.check_null(model_data["modelNumber"])
        height = self.check_null(model_data["height"])
        display_color = self.check_null(model_data["displayColor"])
        eth_ports = self.check_null(model_data["ethernetPorts"])
        pow_ports = self.check_null(model_data["powerPorts"])
        cpu = self.check_null(model_data["cpu"])
        memory = self.check_null(model_data["memory"])
        storage = self.check_null(model_data["storage"])
        comments = self.check_null(model_data["comments"])

        # TODO Add validations

        new_model = Model(
            vendor,
            model_number,
            height,
            display_color,
            eth_ports,
            pow_ports,
            cpu,
            memory,
            storage,
            comments,
        )

        # Add to db

        return "test"

    def delete_model(self, model_data):
        self.check_null(model_data["vendor"])
        self.check_null(model_data["modelNumber"])

        # Delete from db

        return "test"

    def view(self):
        return "test"

    def detail_view(self, model_data):
        self.check_null(model_data["vendor"])
        self.check_null(model_data["modelNumber"])

        return "test"

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
