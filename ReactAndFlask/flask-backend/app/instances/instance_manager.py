from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackTable
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.asset_num_generator import AssetNumGenerator
from app.instances.instance_validator import InstanceValidator


class InstanceManager:
    def __init__(self):
        self.table = InstanceTable()
        self.model_table = ModelTable()
        self.dc_table = DatacenterTable()
        self.rack_table = RackTable()
        self.validate = InstanceValidator()
        self.asset_num_generator = AssetNumGenerator()

    def create_instance(self, instance_data):
        try:
            try:
                new_instance = self.make_instance(instance_data)
                if type(new_instance) is InvalidInputsError:
                    return new_instance
            except InvalidInputsError as e:
                return e.message
            create_validation_result = Constants.API_SUCCESS
            try:
                create_validation_result = self.validate.create_instance_validation(
                    new_instance
                )
                if create_validation_result != Constants.API_SUCCESS:
                    raise InvalidInputsError(create_validation_result)
            except InvalidInputsError as e:
                raise InvalidInputsError(e.message)

            try:
                self.table.add_instance(new_instance)

                if new_instance.mount_type == Constants.BLADE_KEY:
                    return

                power_result = self.add_power_connections(new_instance)
                if power_result != Constants.API_SUCCESS:
                    self.table.delete_instance_by_asset_number(
                        new_instance.asset_number
                    )
                    raise InvalidInputsError(
                        "An error occurred when trying to add power connections."
                    )

                connect_result = self.make_corresponding_connections(
                    new_instance.network_connections, new_instance.hostname
                )
                if connect_result != Constants.API_SUCCESS:
                    self.table.delete_instance_by_asset_number(
                        new_instance.asset_number
                    )
                    raise InvalidInputsError(connect_result)
            except:
                raise
                raise InvalidInputsError("Unable to create instance")
        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to create the asset."
            )

    def delete_instance(self, instance_data):
        asset_number = self.check_null(instance_data[Constants.ASSET_NUMBER_KEY])

        if asset_number == "":
            raise InvalidInputsError("Must provide an asset number")

        asset = self.table.get_instance_by_asset_number(asset_number)
        if asset is None:
            raise InvalidInputsError(
                "The asset you are trying to delete was not found."
            )

        if asset.mount_type == Constants.CHASIS_KEY:
            blade_list = self.table.get_blades_by_chassis_hostname(asset.hostname)
            if blade_list is not None:
                raise InvalidInputsError(
                    "A blade chassis must be empty before it can be decommissioned or deleted."
                )

        delete_power_result = self.delete_power_connections(asset)
        if delete_power_result != Constants.API_SUCCESS:
            raise InvalidInputsError(
                "An error occurred when trying to remove power connections."
            )

        delete_connection_result = self.delete_connections(asset)
        if delete_connection_result != Constants.API_SUCCESS:
            raise InvalidInputsError(delete_connection_result)

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
            if type(new_instance) is InvalidInputsError:
                return new_instance

            self.delete_power_connections(original_asset_number)

            delete_connection_result = self.delete_connections(original_asset_number)
            if delete_connection_result != Constants.API_SUCCESS:
                raise InvalidInputsError("Failed to update network connections.")

            edit_validation_result = self.validate.edit_instance_validation(
                new_instance, original_asset_number
            )
            if edit_validation_result != Constants.API_SUCCESS:
                original_instance = self.table.get_instance_by_asset_number(
                    original_asset_number
                )
                self.make_corresponding_connections(
                    original_instance.network_connections, original_instance.hostname
                )
                raise InvalidInputsError(edit_validation_result)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)

        self.add_power_connections(new_instance)

        edit_connection_result = self.make_corresponding_connections(
            new_instance.network_connections, new_instance.hostname
        )
        if edit_connection_result != Constants.API_SUCCESS:
            original_instance = self.table.get_instance_by_asset_number(
                original_asset_number
            )
            self.make_corresponding_connections(
                original_instance.network_connections, original_instance.hostname
            )
            raise InvalidInputsError(edit_connection_result)

        self.table.edit_instance(new_instance, original_asset_number)

    def get_instances(self, filter, dc_name, limit: int):
        model_name = filter.get(Constants.MODEL_KEY)
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

        hostname = filter.get(Constants.HOSTNAME_KEY)
        rack_label = filter.get(Constants.RACK_KEY)
        rack_position = filter.get(Constants.RACK_POSITION_KEY)

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
        model_name = self.check_null(instance_data[Constants.MODEL_KEY])
        model_id = self.get_model_id_from_name(model_name)
        model = self.get_model_from_id(model_id)

        mount_type = model.mount_type

        datacenter_name = self.check_null(instance_data[Constants.DC_NAME_KEY])
        datacenter_id = self.get_datacenter_id_from_name(datacenter_name)
        try:
            hostname = self.check_null(instance_data[Constants.HOSTNAME_KEY])
            rack = self.check_null(instance_data[Constants.RACK_KEY].upper())
            rack_position = self.check_null(instance_data[Constants.RACK_POSITION_KEY])
            owner = self.check_null(instance_data[Constants.OWNER_KEY])
            comment = self.check_null(instance_data[Constants.COMMENT_KEY])
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

        display_color = self.asset_or_model_val(
            instance_data.get(Constants.DISPLAY_COLOR_KEY), model.display_color
        )
        cpu = self.asset_or_model_val(instance_data.get(Constants.CPU_KEY), model.cpu)
        self.asset_or_model_val(instance_data.get(Constants.CPU_KEY), model.cpu)
        memory = self.asset_or_model_val(
            instance_data.get(Constants.MEMORY_KEY), model.memory
        )
        storage = self.asset_or_model_val(
            instance_data.get(Constants.STORAGE_KEY), model.storage
        )

        if mount_type == Constants.BLADE_KEY:
            chassis_hostname = instance_data.get(Constants.CHASSIS_HOSTNAME_KEY)
            chassis_slot = instance_data.get(Constants.CHASSIS_SLOT_KEY)
        else:
            chassis_hostname = ""
            chassis_slot = -1

        # if rack == "":
        #     return InvalidInputsError("Must provide a rack location")
        # if rack_position == "":
        #     return InvalidInputsError("Must provide a rack location")
        if asset_number == "":
            return InvalidInputsError("Must provide an asset number")

        return Instance(
            model_id,
            hostname,
            rack,
            rack_position,
            owner,
            comment,
            datacenter_id,
            network_connections,
            power_connections,
            asset_number,
            mount_type,
            display_color,
            cpu,
            memory,
            storage,
            chassis_hostname,
            chassis_slot,
        )

    def get_model_id_from_name(self, model_name):
        try:
            model_list = self.model_table.get_all_models()
            for model in model_list:
                if model.vendor + " " + model.model_number == model_name:
                    print("FOUND MATCH")
                    model_id = self.model_table.get_model_id_by_vendor_number(
                        model.vendor, model.model_number
                    )
                    if model_id is None:
                        model_id = -1

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

    def get_dc_from_id(self, dc_id):
        datacenter = self.dc_table.get_datacenter(dc_id)
        if datacenter is None:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve datacenter info corresponding to the instance."
            )

        return datacenter

    def make_corresponding_connections(self, network_connections, hostname):
        for port in network_connections:
            connection_hostname = network_connections[port]["connection_hostname"]
            connection_port = network_connections[port]["connection_port"]

            if connection_hostname == "" and connection_port == "":
                continue

            print("SEARCH " + connection_hostname)
            other_instance = self.table.get_instance_by_hostname(connection_hostname)
            print("COMPLETE")
            if other_instance is None:
                return f"An error occurred when attempting to add the network connection. Could not find asset with hostname {connection_hostname}."

            other_instance.network_connections[connection_port][
                "connection_hostname"
            ] = hostname
            other_instance.network_connections[connection_port][
                "connection_port"
            ] = port
            print(other_instance.network_connections)

            try:
                print("EDITIG")
                self.table.edit_instance(other_instance, other_instance.asset_number)
                print("EDITED SUCCESS")
            except:
                return f"Could not add new network connections to asset with hostname {other_instance.hostname}."

        return Constants.API_SUCCESS

    def delete_connections(self, asset):
        if asset is None:
            return "Failed to find the asset to delete"

        for port in asset.network_connections:
            connection_hostname = asset.network_connections[port]["connection_hostname"]
            connection_port = asset.network_connections[port]["connection_port"]

            if connection_hostname == "" and connection_port == "":
                continue

            other_instance = self.table.get_instance_by_hostname(connection_hostname)
            if other_instance is None:
                return f"An error occurred when attempting to delete the network connection. Could not find asset with hostname {connection_hostname}."

            other_instance.network_connections[connection_port][
                "connection_hostname"
            ] = ""
            other_instance.network_connections[connection_port]["connection_port"] = ""
            print(other_instance.network_connections)

            try:
                print("EDITIG")
                self.table.edit_instance(other_instance, other_instance.asset_number)
                print("EDITED SUCCESS")
            except:
                return f"Could not add new network connections to asset with hostname {other_instance.hostname}."

        return Constants.API_SUCCESS

    def add_power_connections(self, instance):
        rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
        if rack is None:
            return f"Could not find rack {instance.rack_label}"

        for p_connection in instance.power_connections:
            char1 = p_connection[0].upper()
            num = int(p_connection[1:])
            if char1 == "L":
                rack.pdu_left[num - 1] = 1
            elif char1 == "R":
                rack.pdu_right[num - 1] = 1
            else:
                return "Invalid power connection. Please specify left or right PDU."

        self.rack_table.edit_rack(rack)
        return Constants.API_SUCCESS

    def delete_power_connections(self, instance):
        if instance is None:
            return "Asset could not be found."

        rack = self.rack_table.get_rack(instance.rack_label, instance.datacenter_id)
        if rack is None:
            return f"Could not find rack {instance.rack_label}"

        for p_connection in instance.power_connections:
            char1 = p_connection[0].upper()
            num = int(p_connection[1:])
            if char1 == "L":
                rack.pdu_left[num - 1] = 0
            elif char1 == "R":
                rack.pdu_right[num - 1] = 0
            else:
                return "Invalid power connection. Please specify left or right PDU."

        self.rack_table.edit_rack(rack)
        return Constants.API_SUCCESS

    def get_network_neighborhood(self, asset_number):
        if asset_number is None or asset_number == "":
            raise InvalidInputsError("No asset number found in the request.")

        asset = self.table.get_instance_by_asset_number(asset_number)
        if asset is None:
            raise InvalidInputsError("The asset requested could not be found.")

        connections_dict = {}

        if asset.mount_type == Constants.CHASIS_KEY:
            blade_list = self.table.get_blades_by_chassis_hostname(asset.hostname)
            for blade in blade_list:
                connections_dict[blade.hostname] = []

        is_blade = asset.mount_type == Constants.BLADE_KEY
        if is_blade:
            connected_asset = self.table.get_instance_by_hostname(
                asset.chassis_hostname
            )
            if connected_asset is None:
                raise InvalidInputsError(
                    f"Connection to asset with hostname {asset.chassis_hostname} was not found."
                )
            two_deep_list = self.make_two_deep_list(connected_asset)
            connections_dict[connected_asset.hostname] = two_deep_list
        else:
            for port in asset.network_connections:
                hostname = asset.network_connections[port]["connection_hostname"]
                if hostname is None or hostname == "":
                    continue
                connected_asset = self.table.get_instance_by_hostname(hostname)
                if connected_asset is None:
                    raise InvalidInputsError(
                        f"Connection to asset with hostname {hostname} was not found."
                    )
                two_deep_list = self.make_two_deep_list(connected_asset)
                connections_dict[hostname] = two_deep_list

        return connections_dict

    def make_two_deep_list(self, connected_asset):
        two_deep_list = []
        if connected_asset.mount_type == Constants.CHASIS_KEY:
            blade_list = self.table.get_blades_by_chassis_hostname(
                connected_asset.hostname
            )
            for blade in blade_list:
                two_deep_list.append(blade.hostname)

        for port2 in connected_asset.network_connections:
            host2 = connected_asset.network_connections[port2]["connection_hostname"]
            two_deep_list.append(host2)

        return two_deep_list

    def get_all_chassis(self):
        try:
            chassis_list = self.table.get_asset_by_mount_type(Constants.CHASIS_KEY)
            if chassis_list is None:
                chassis_list = []
            return chassis_list
        except:
            raise InvalidInputsError(
                "An error occurred while trying to retrieve blade chassis."
            )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val

    def asset_or_model_val(self, instance_val, model_val):
        if self.check_null(instance_val) != "":
            return instance_val
        else:
            return model_val
