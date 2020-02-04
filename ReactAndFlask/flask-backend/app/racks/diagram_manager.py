from typing import Dict, List

from app.main.types import JSON
from fpdf import FPDF


class DiagramManager:
    def generate_diagram(self, rack_details: List[JSON]):
        """ Generates a rack diagram pdf """
        # Create pdf
        pdf: FPDF = FPDF(orientation="L")
        pdf.set_font(family="Arial", size=8)
        pdf.set_fill_color(r=144, g=238, b=144)

        # Computes how many pages are needed at 3 racks per page
        number_of_pages: int = len(rack_details) // 3
        number_of_pages += 1 if (len(rack_details) % 3) != 0 else 0

        # Generates each page of the pdf
        for i in range(number_of_pages):
            self._generate_page(pdf=pdf, rack_details=rack_details[i * 3 : (i + 1) * 3])

        pdf.output(
            name="ReactAndFlask/flask-backend/static/react/diagram.pdf", dest="F"
        )
        return "/static/react/diagram.pdf"

    def _generate_page(self, pdf: FPDF, rack_details: List[JSON]):
        pdf.add_page()

        for i in range(43, 0, -1):
            for details in rack_details:
                if i == 43:
                    pdf.cell(w=75, h=5, txt=list(details.keys())[0], align="C")
                    pdf.cell(w=20, h=5)
                else:
                    instances: List[JSON] = details[list(details.keys())[0]]
                    positions: Dict[int, str] = {}

                    for instance in instances:
                        position: int = int(instance.get("rack_position", "0"))
                        height: int = int(instance.get("height", "0"))
                        for t in range(position, position + height + 1):
                            positions[t] = instance["hostname"]

                    pdf.cell(w=10, h=4, txt=f"{i}", align="C", border=1)

                    if i in positions:
                        pdf.cell(
                            w=65,
                            h=4,
                            txt=f"{positions[i]}",
                            align="C",
                            border=1,
                            fill=1 if i in positions else 0,
                        )
                    else:
                        pdf.cell(w=65, h=4, border=1, fill=1 if i in positions else 0)
                    pdf.cell(w=20, h=4)
            if i == 43:
                pdf.ln(7)
            else:
                pdf.ln(4)
