from app.change_plans.change_plan_action_manager import ChangePlanActionManager
from app.constants import Constants
from app.exceptions.InvalidInputsException import InvalidInputsError
from fpdf import FPDF


class WorkOrder:
    def __init__(self):
        self.cp_action_manager = ChangePlanActionManager()

    def generate_order(self, cp_id):
        try:
            cp_action_list = self.cp_action_manager.get_change_plan_actions(cp_id)

            pdf: FPDF = FPDF("P", "in", "Letter")
            pdf.add_page()

            pdf.set_font("Arial", "", 18)
            pdf.cell(8, 0.6, txt="Work Order", border="", ln=2)

            for cp_action in cp_action_list:
                if cp_action.action == Constants.COLLATERAL_KEY:
                    continue

                text = []
                if cp_action.action == Constants.CREATE_KEY:
                    start = self.make_step_heading(cp_action)
                    model = "Model: " + cp_action.new_record.get(Constants.MODEL_KEY)
                    text.append(model)
                    datacenter = "Datacenter: " + cp_action.new_record.get(
                        Constants.DC_NAME_KEY
                    )
                    text.append(datacenter)
                    if (
                        cp_action.new_record.get(Constants.MOUNT_TYPE_KEY)
                        == Constants.BLADE_KEY
                    ):
                        location = (
                            "Chassis Hostname: "
                            + cp_action.new_record.get(Constants.CHASSIS_HOSTNAME_KEY)
                            + " slot "
                            + str(cp_action.new_record.get(Constants.CHASSIS_SLOT_KEY))
                        )
                    else:
                        location = (
                            "Rack: "
                            + cp_action.new_record.get(Constants.RACK_KEY)
                            + " U"
                            + str(cp_action.new_record.get(Constants.RACK_POSITION_KEY))
                        )
                    text.append(location)
                    hostname = self.hostname_to_str(
                        cp_action.new_record.get(Constants.HOSTNAME_KEY)
                    )
                    text.append(hostname)
                    if (
                        cp_action.new_record.get(Constants.MOUNT_TYPE_KEY)
                        != Constants.BLADE_KEY
                    ):
                        power_connections = self.pow_con_to_str(
                            cp_action.new_record.get(Constants.POWER_CONNECTIONS_KEY)
                        )
                        text.append(power_connections)
                        network_connections = self.net_con_to_str(
                            cp_action.new_record.get(Constants.NETWORK_CONNECTIONS_KEY)
                        )
                        text.append(network_connections)
                elif cp_action.action == Constants.UPDATE_KEY:
                    start = self.make_step_heading(cp_action)
                    if (
                        Constants.RACK_KEY in cp_action.diff
                        or Constants.RACK_POSITION_KEY in cp_action.diff
                    ):
                        location = (
                            "Original Rack Location: "
                            + cp_action.old_record.get(Constants.RACK_KEY)
                            + " U"
                            + str(cp_action.old_record.get(Constants.RACK_POSITION_KEY))
                        )
                    else:
                        location = (
                            "Original Rack Location: "
                            + cp_action.new_record.get(Constants.RACK_KEY)
                            + " U"
                            + str(cp_action.new_record.get(Constants.RACK_POSITION_KEY))
                        )
                    text.append(location)

                    for key in cp_action.diff:
                        if key == Constants.NETWORK_CONNECTIONS_KEY:
                            val = self.net_con_to_str(
                                cp_action.new_record.get(
                                    Constants.NETWORK_CONNECTIONS_KEY
                                )
                            )
                        elif key == Constants.POWER_CONNECTIONS_KEY:
                            val = self.pow_con_to_str(
                                cp_action.new_record.get(
                                    Constants.POWER_CONNECTIONS_KEY
                                )
                            )
                        else:
                            val = (
                                key
                                + ": "
                                + str(cp_action.diff[key][1])
                                + " (originally "
                                + str(cp_action.diff[key][0])
                                + ")"
                            )
                        text.append(val)
                elif cp_action.action == Constants.DECOMMISSION_KEY:
                    start = self.make_step_heading(cp_action)
                    model = "Model: " + cp_action.new_record.get(Constants.MODEL_KEY)
                    text.append(model)
                    datacenter = "Datacenter: " + cp_action.new_record.get(
                        Constants.DC_NAME_KEY
                    )
                    text.append(datacenter)
                    if (
                        cp_action.new_record.get(Constants.MOUNT_TYPE_KEY)
                        == Constants.BLADE_KEY
                    ):
                        location = (
                            "Chassis Hostname: "
                            + cp_action.new_record.get(Constants.CHASSIS_HOSTNAME_KEY)
                            + " slot "
                            + str(cp_action.new_record.get(Constants.CHASSIS_SLOT_KEY))
                        )
                    else:
                        location = (
                            "Rack: "
                            + cp_action.new_record.get(Constants.RACK_KEY)
                            + " U"
                            + str(cp_action.new_record.get(Constants.RACK_POSITION_KEY))
                        )
                    text.append(location)
                    hostname = self.hostname_to_str(
                        cp_action.new_record.get(Constants.HOSTNAME_KEY)
                    )
                    text.append(hostname)
                    text.append(
                        "Remove all network and power connections if connected."
                    )

                pdf.set_font("Arial", "", 14)
                pdf.cell(8, 0.6, txt=start, border="", ln=2)
                pdf.set_font("Arial", "", 12)
                for val in text:
                    pdf.multi_cell(w=0, h=0.2, txt=val)

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

    def hostname_to_str(self, hostname):
        if hostname is None or hostname == "":
            hostname = "None"
        return "Hostname: " + hostname

    def pow_con_to_str(self, pow_connections):
        if pow_connections is None or len(pow_connections) == 0:
            return "Power Connections: None"

        val = ""
        count = 0
        for connection in pow_connections:
            if count != 0:
                val += ", "
            if connection[0].upper() == "L":
                val += "Left PDU Port "
            elif connection[0].upper() == "R":
                val += "Right PDU Port "

            val += connection[1:]
            count += 1

        return "Power Connections: " + val

    def net_con_to_str(self, network_connections):
        print(network_connections)
        if network_connections is None or len(network_connections) == 0:
            return "Network Connections: None"

        val = f"Network Connections: \n"
        for port in network_connections:
            print(type(network_connections[port]))
            print(network_connections[port])
            connection_hostname = network_connections[port]["connection_hostname"]
            connection_port = network_connections[port]["connection_port"]
            val += f"     Connect port {port} to host {connection_hostname} on port {connection_port}. \n"

        return val
