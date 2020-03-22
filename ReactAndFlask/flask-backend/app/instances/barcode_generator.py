from app.constants import Constants


class BarcodeGenerator:
    def __init__(self):
        self.labels_per_page = 72

    def create_barcode_labels(self, asset_data):
        try:
            asset_nums = asset_data[Constants.ASSET_NUMBER_KEY]
        except:
            asset_nums = []

        # Format 72 per page 4 wide 18 high
        # 1.75x4 wide = 7 0.5x18 tall = 9
        # 0.3 inch margin left/right 0.105 inch margin top/bottom

        num_pages = len(asset_nums) // self.labels_per_page
        if len(asset_nums) % self.labels_per_page != 0:
            num_pages += 1

        for i in range(num_pages):
            self._create_page(
                asset_nums[i * self.labels_per_page : (i + 1) * self.labels_per_page]
            )

        return asset_nums

    def _create_page(self, asset_nums_list):
        for asset_number in asset_nums_list:
            pass
