from typing import List

from app.constants import Constants
from barcode.codex import Code128
from barcode.writer import ImageWriter
from fpdf import FPDF
from PIL import Image, ImageDraw, ImageFont


class BarcodeGenerator:
    def __init__(self):
        self.labels_per_page = 80
        self.barcode_path = "ReactAndFlask/flask-backend/static/barcode"

    def create_barcode_labels(self, asset_data):
        try:
            asset_nums = asset_data[Constants.ASSET_NUMBER_KEY]
        except:
            asset_nums = []

        pdf: FPDF = FPDF("P", "in", "Letter")
        num_pages = len(asset_nums) // self.labels_per_page
        if len(asset_nums) % self.labels_per_page != 0:
            num_pages += 1

        for i in range(num_pages):
            self._create_page(
                pdf,
                asset_nums[i * self.labels_per_page : (i + 1) * self.labels_per_page],
            )

        pdf.output(name="ReactAndFlask/flask-backend/static/asset_labels.pdf")

    def _create_page(self, pdf: FPDF, asset_nums_list: List[int]):
        pdf.add_page()

        counter = 0
        for asset_number in asset_nums_list:
            self._make_barcode(asset_number)
            x = 0.3 + ((counter // 20) * 2.05)
            y = 0.5 + ((counter % 20) * 0.5)
            image_path = self.barcode_path + str(asset_number) + ".png"
            pdf.image(image_path, x=x, y=y, w=1.75, h=0.5)
            counter += 1

    def _make_barcode(self, asset_number: int):
        font = ImageFont.truetype("ReactAndFlask/flask-backend/fonts/arial.ttf", 12)

        code = Code128(str(asset_number), writer=ImageWriter())
        barcode_image = code.render(text="")
        barcode_image = barcode_image.resize((348, 75))

        image = Image.new("RGB", (348, 98), (255, 255, 255))
        image.paste(
            barcode_image,
            tuple(
                map(
                    lambda x: int((x[0] - x[1]) / 2),
                    zip((350, 100), barcode_image.size),
                )
            ),
        )

        draw = ImageDraw.Draw(image)
        draw.text((50, 83), "HypoSoft", fill="black", font=font)
        draw.text((175, 83), str(asset_number), fill="black", font=font)

        border = Image.new("RGB", (350, 100), (0, 0, 0))
        border.paste(
            image,
            tuple(map(lambda x: int((x[0] - x[1]) / 2), zip((350, 100), image.size))),
        )

        image_path = self.barcode_path + str(asset_number) + ".png"
        border.save(image_path, "PNG")
