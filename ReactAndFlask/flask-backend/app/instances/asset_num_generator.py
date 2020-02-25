import json
import os

from app.dal.instance_table import InstanceTable


class AssetNumGenerator:
    def __init__(self):
        self.table = InstanceTable()
        self.asset_num_file = "/asset_num.json"
        self.dirname = os.path.dirname(__file__)
        self.next_asset_num = 100001

        self.__setup_asset_num_file()

    def __setup_asset_num_file(self):
        asset_num_file_template = {"start_num": 100001, "next_num": 100001}

        if not os.path.exists(self.dirname + self.asset_num_file):
            try:
                with open(self.dirname + self.asset_num_file, "w+") as outfile:
                    json.dump(asset_num_file_template, outfile, indent=4)
            except IOError as e:
                print(str(e))
                raise InvalidInputsError("Could not create asset number data file")

    def __get_asset_num_data(self):
        asset_num_data = {}
        try:
            with open(self.dirname + self.asset_num_file, "r") as infile:
                asset_num_data = json.load(infile)
        except IOError as e:
            print(str(e))
            raise InvalidInputsError("Failed to load current asset number")

        return asset_num_data

    def __get_next_asset_num(self):
        data = self.__get_asset_num_data()

        return data.get("next_num")

    def __update_next_asset_num(self, next_asset_num):
        self.next_asset_num = next_asset_num
        asset_num_data = self.__get_asset_num_data()
        asset_num_data["next_num"] = next_asset_num
        try:
            with open(self.dirname + self.asset_num_file, "w") as outfile:
                json.dump(asset_num_data, outfile, indent=4)
        except IOError as e:
            print(str(e))
            raise InvalidInputsError("Failed to update asset number data file")

    def __find_valid_asset_num(self, offset):
        next_asset_num = self.__get_next_asset_num() + offset
        asset = self.table.get_instance_by_asset_number(next_asset_num)
        while asset is not None:
            next_asset_num += 1
            asset = self.table.get_instance_by_asset_number(next_asset_num)

        return next_asset_num

    def get_next_asset_number(self):
        asset_num = self.__find_valid_asset_num(0)
        next_asset_num = self.__find_valid_asset_num(0)
        self.__update_next_asset_num(next_asset_num)

        return asset_num
