"""
Connect to PDU Networkx 98 Pro to turn on/off network connected power ports
"""

import re

import requests
from app.constants import Constants
from app.exceptions.InvalidInputsException import InvalidInputsError


class PDUNet98ProManager:
    def __init__(self):
        pass

    @staticmethod
    def validate_state(state):
        if state not in ["on", "off"]:
            raise InvalidInputsError("State must be either 'on' or 'off'")

    @staticmethod
    def validate_port(port):
        if not (1 <= port <= 24):
            raise InvalidInputsError("Port number must be between 1 and 24 inclusive")

    @staticmethod
    def validate_rack_details(rack_letter, rack_number, side):
        if not ("A" <= rack_letter <= "E"):
            raise InvalidInputsError("Rack letter must be between A and E inclusive")
        if not (1 <= rack_number <= 19):
            raise InvalidInputsError("Rack number must be between 1 and 19 inclusive")
        if not (side == "L" or side == "R"):
            raise InvalidInputsError("Side must be either 'L' or 'R'")

    def format_pdu_id(self, rack_letter, rack_number, side):
        rack_letter = rack_letter.upper()
        side = side.upper()
        try:
            self.validate_rack_details(rack_letter, rack_number, side)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)

        return f"hpdu-rtp1-{rack_letter}{rack_number:02d}{side}"

    def set_pdu_power(self, rack_letter, rack_number, side, port, state):
        state = state.lower()
        pdu_id = ""
        try:
            self.validate_state(state)
            self.validate_port(port)
            pdu_id = self.format_pdu_id(rack_letter, rack_number, side)
        except InvalidInputsError as e:
            raise InvalidInputsError(e.message)
        url = f"{Constants.PDU_NET_PRO_HOST}:{Constants.PDU_NET_PRO_PORT}/power.php"

        data = {
            "v": state,
            "pdu": pdu_id,
            "port": port,
        }

        response = requests.post(url, data=data)
        if response.status_code != 200:
            raise InvalidInputsError(
                "Could not set PDU power remotely, request failed."
            )

        return response.status_code

    def get_pdu_power_states(self, rack_letter, rack_number, side):
        pdu_id = self.format_pdu_id(rack_letter, rack_number, side)
        url = f"{Constants.PDU_NET_PRO_HOST}:{Constants.PDU_NET_PRO_PORT}/pdu.php?pdu={pdu_id}"

        response_content = requests.get(url).content
        html = response_content.decode("utf-8")
        table = re.findall("(<table.*table>)", html, re.DOTALL)[0]
        pdus = re.findall(
            "<td>(.*)<td><span style='background-color:.*'>(.*)</span>", table
        )

        states = {}
        for pdu in pdus:
            states[pdu[0]] = pdu[1]

        return states
