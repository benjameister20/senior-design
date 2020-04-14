import os
import re

from app.exceptions.InvalidInputsException import InvalidInputsError


class BMIManager:
    def __init__(self):
        self.context = os.path.dirname(__file__)

    @staticmethod
    def __validate_port(asset: int):
        if not (1 <= asset <= 14):
            raise InvalidInputsError("Port number must be between 1 and 14 inclusive")

    @staticmethod
    def __validate_power_state(state: str):
        if not (state in ["on", "off"]):
            raise InvalidInputsError("Asset state can only be 'on' or 'off'")

    def set_port_power_state(self, chassis: str, port: int, power_state: str):
        power_state = power_state.lower()
        self.__validate_port(port)
        self.__validate_power_state(power_state)

        os.system(f"{self.context}/bmi-connect.sh {chassis} {port} {power_state}")

    def get_chassis_power_states_all(self, chassis) -> dict:
        os.system(f"{self.context}/bmi-query.exp {chassis}")

        states = {}
        lines = []
        with open("expect_log.log", "r") as f:
            lines = f.readlines()

        pattern = re.compile("^  \\[(.+)\\] (.+)\\n$")
        for line in lines:
            result = re.findall(pattern, line)[0]
            states[result[0]] = result[1]

        print("")
        print(states)

        return states

    def get_chassis_power_state_single(self, chassis, port: int):
        self.__validate_port(port)
        port_power_states = self.get_chassis_power_states_all(chassis)
        port_number = str(port)

        return port_power_states[port_number]
