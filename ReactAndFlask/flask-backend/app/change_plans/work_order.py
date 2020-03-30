from app.change_plans.change_plan_action_manager import ChangePlanActionManager
from app.constants import Constants
from app.exceptions.InvalidInputsException import InvalidInputsError
from fpdf import FPDF

import json

class WorkOrder:
    def __init__(self):
        self.cp_action_manager = ChangePlanActionManager()

    def generate_order(self, cp_id):
        try:
            cp_action_list = self.cp_action_manager.get_change_plan_actions(cp_id)

            pdf: FPDF = FPDF("P", "in", "Letter")
            pdf.add_page()
            pdf.set_font("Arial", "", 14)

            for cp_action in cp_action_list:
                if cp_action.action == Constants.CREATE_KEY:
                    start = self.make_step_heading(cp_action)
                    text = json.dumps(cp_action.new_record, indent=4)
                elif cp_action.action == Constants.UPDATE_KEY:
                    start = self.make_step_heading(cp_action)
                    text = json.dumps(cp_action.new_record, indent=4)
                elif cp_action.action == Constants.DECOMMISSION_KEY:
                    start = self.make_step_heading(cp_action)
                elif cp_action.action == Constants.COLLATERAL_KEY:
                    start = self.make_step_heading(cp_action)
                    text = json.dumps(cp_action.new_record, indent=4)

                pdf.set_font("Arial", "", 14)
                pdf.cell(8, 0.6, txt=start, border="", ln=2)
                for val in cp_action.new_record.items():
                    pdf.multi_cell(w=0,h=0.2,txt="%s: %s" % val)

                # pdf.set_font("Arial", "", 10)
                # pdf.cell(8, 1.2, txt=text, border="B", ln=2)

            pdf.output(name="ReactAndFlask/flask-backend/static/work_order.pdf")
        except Exception as e:
            print(e)
            raise InvalidInputsError("Work order could not be generated.")

    def make_step_heading(self, cp_action):
        return (
            "Step "
            + str(cp_action.step)
            + ": "
            + cp_action.action.upper()
            + " asset "
            + str(cp_action.new_record.get(Constants.ASSET_NUMBER_KEY))
        )
