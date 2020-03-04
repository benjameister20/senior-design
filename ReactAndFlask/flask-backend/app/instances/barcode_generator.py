from app.constants import Constants


class BarcodeGenerator:
    def __init__(self):
        pass

    def create_barcode_labels(self, asset_data):
        try:
            asset_nums = asset_data[Constants.ASSET_NUMBER_KEY]
        except:
            asset_nums = []

        for asset_number in asset_nums:
            pass

        return asset_nums
