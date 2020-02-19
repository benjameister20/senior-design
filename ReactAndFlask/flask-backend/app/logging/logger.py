# TODO: Fix whole log_syntax thing
# TODO: Finish log messages for models and racks
# TODO: Test logger


import json
import os
from datetime import datetime

from app.constants import Constants


class UserActions:
    CREATE = "CREATE"
    EDIT = "EDIT"
    DELETE = "DELETE"
    AUTHENTICATE = "AUTHENTICATE"
    LOGOUT = "LOGOUT"
    OAUTH = "OAUTH"


class ModelActions:
    CREATE = "CREATE"
    EDIT = "EDIT"
    DELETE = "DELETE"


class InstanceActions:
    CREATE = "CREATE"
    EDIT = "EDIT"
    DELETE = "DELETE"


class RackActions:
    CREATE = "CREATE"
    DELETE = "DELETE"


class Actions:
    USERS = UserActions()
    MODELS = ModelActions()
    INSTANCES = InstanceActions()
    RACKS = RackActions()


class Logger:

    MODELS = "model"
    INSTANCES = "asset"
    RACKS = "rack"
    USERS = "users"
    ACTIONS = Actions()

    def __init__(self):
        self.logfile = "/app.log"
        self.dirname = os.path.dirname(__file__)
        self.LOG = {}
        with open(self.dirname + self.logfile, "r") as infile:
            self.LOG = json.load(infile)

    @staticmethod
    def __add_timestamp(log_message):
        log_message = f"[{str(datetime.now())}] - {log_message}"

        return log_message

    def __log_user_request(self, request, action):
        # username = request.get(Constants.USERNAME_KEY)
        # old_username = request.get(Constants.OLD_USERNAME_KEY)
        # email = request.get(Constants.EMAIL_KEY)
        # display_name = request.get(Constants.DISPLAY_NAME_KEY)
        # privilege = request.get(Constants.PRIVILEGE_KEY)

        if action == Logger.ACTIONS.USERS.CREATE:
            log_message = f"""CREATE user (
                Username: <<{Constants.USERNAME_KEY}>>
                Email: <<{Constants.EMAIL_KEY}>>
                Display Name: <<{Constants.DISPLAY_NAME_KEY}>>
                Privilege: <<{Constants.PRIVILEGE_KEY}>>
                )"""

        if action == Logger.ACTIONS.USERS.EDIT:
            log_message = f"""EDIT user (
                Username: <<{Constants.OLD_USERNAME_KEY}>>
                ) becomes (
                Username: <<{Constants.USERNAME_KEY}>>
                Email: <<{Constants.EMAIL_KEY}>>
                Display Name: <<{Constants.DISPLAY_NAME_KEY}>>
                Privilege: <<{Constants.PRIVILEGE_KEY}>>
                )"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.USERS.DELETE:
            log_message = f"""DELETE user (
                Username: <<{Constants.USERNAME_KEY}>>
                )"""
            # log_syntax = "DELETE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.AUTHENTICATE:
            log_message = f"""AUTHENTICATE user (
                Username: <<{Constants.USERNAME_KEY}>>
                )"""
            # log_syntax = "AUTHENTICATE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.LOGOUT:
            log_message = f"""LOGOUT user (
                Username: <<{Constants.USERNAME_KEY}>>
                )"""
            # log_syntax = "LOGOUT user (<<username>>)"

        if action == Logger.ACTIONS.USERS.OAUTH:
            log_message = f"""OAUTH user (
                Username: <<{Constants.USERNAME_KEY}>>
                )"""
            # log_syntax = "OAUTH user (<<username>>)"

        return log_message

    def __log_instance_request(self, request, action):
        # original_asset_number = request.get(Constants.ASSET_NUMBER_ORIG_KEY)
        # model_name = request.get(Constants.MODEL_KEY)
        # datacenter_name = request.get(Constants.DATACENTER_KEY)
        # hostname = request.get(Constants.HOSTNAME_KEY)
        # rack = request.get(Constants.RACK_KEY)
        # rack_position = request.get(Constants.RACK_POSITION_KEY)
        # owner = request.get(Constants.OWNER_KEY)
        # comment = request.get(Constants.COMMENT_KEY)
        # mac_address = request.get(Constants.MAC_ADDRESS_KEY)
        # network_connections = request.get(
        #     Constants.NETWORK_CONNECTIONS_KEY
        # )
        # power_connections = request.get(
        #     Constants.POWER_CONNECTIONS_KEY
        # )
        # asset_number = request.get(Constants.ASSET_NUMBER_KEY)

        if action == Logger.ACTIONS.INSTANCES.CREATE:
            log_message = f"""CREATE asset (
                Model Name: <<{Constants.MODEL_KEY}>>
                Datacenter Name: <<{Constants.DATACENTER_KEY}>>
                Hostname: <<{Constants.HOSTNAME_KEY}>>
                Rack: <<{Constants.RACK_KEY}>>
                Rack Position: <<{Constants.RACK_POSITION_KEY}>>
                Owner: <<{Constants.OWNER_KEY}>>
                Comment: <<{Constants.COMMENT_KEY}>>
                MAC Address: <<{Constants.MAC_ADDRESS_KEY}>>
                Asset Number: <<{Constants.ASSET_NUMBER_KEY}>>
                )"""
            # log_syntax = """CREATE instance (
            #     <<model_name>>, <<email>>, <<display_name>>, <<privilege>>)"""

        if action == Logger.ACTIONS.INSTANCES.EDIT:
            log_message = f"""EDIT asset (
                Asset Number: <<{Constants.ASSET_NUMBER_ORIG_KEY}>>
                ) becomes: (
                Model Name: <<{Constants.MODEL_KEY}>>
                Datacenter Name: <<{Constants.DATACENTER_KEY}>>
                Hostname: <<{Constants.HOSTNAME_KEY}>>
                Rack: <<{Constants.RACK_KEY}>>
                Rack Position: <<{Constants.RACK_POSITION_KEY}>>
                Owner: <<{Constants.OWNER_KEY}>>
                Comment: <<{Constants.COMMENT_KEY}>>
                MAC Address: <<{Constants.MAC_ADDRESS_KEY}>>
                Asset Number: <<{Constants.ASSET_NUMBER_KEY}>>
                )"""
            # log_syntax = "EDIT instance (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.INSTANCES.DELETE:
            log_message = f"""DELETE asset (
                Model Name: <<{Constants.MODEL_KEY}>>
                Datacenter Name: <<{Constants.DATACENTER_KEY}>>
                Hostname: <<{Constants.HOSTNAME_KEY}>>
                )"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_model_request(self, request, action):
        if action == Logger.ACTIONS.MODELS.CREATE:
            log_message = f"""CREATE model (
                Vendor: <<{Constants.VENDOR_KEY}>>
                Model Number: <<{Constants.MODEL_NUMBER_KEY}>>
                Height: <<{Constants.HEIGHT_KEY}>>
                Display Color: <<{Constants.DISPLAY_COLOR_KEY}>>
                Ethernet Ports: <<{Constants.ETHERNET_PORT_KEY}>>
                Power Ports: <<{Constants.POWER_PORT_KEY}>>
                CPU: <<{Constants.CPU_KEY}>>
                Memory: <<{Constants.MEMORY_KEY}>>
                Storage: <<{Constants.STORAGE_KEY}>>
                Comment: <<{Constants.COMMENT_KEY}>>
                )"""
            # log_syntax = "CREATE user (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.EDIT:
            log_message = f"""EDIT model (
                Vendor: <<{Constants.VENDOR_KEY}>>
                Model Number: <<{Constants.MODEL_NUMBER_KEY}>>
                ) becomes: (
                Vendor: <<{Constants.VENDOR_KEY}>>
                Model Number: <<{Constants.MODEL_NUMBER_KEY}>>
                Height: <<{Constants.HEIGHT_KEY}>>
                Display Color: <<{Constants.DISPLAY_COLOR_KEY}>>
                Ethernet Ports: <<{Constants.ETHERNET_PORT_KEY}>>
                Power Ports: <<{Constants.POWER_PORT_KEY}>>
                CPU: <<{Constants.CPU_KEY}>>
                Memory: <<{Constants.MEMORY_KEY}>>
                Storage: <<{Constants.STORAGE_KEY}>>
                Comment: <<{Constants.COMMENT_KEY}>>
                )"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.DELETE:
            log_message = f"""DELETE model (
                Vendor: <<{Constants.VENDOR_KEY}>>
                Model Number: <<{Constants.MODEL_NUMBER_KEY}>>
                )"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_rack_request(self, request, action):

        return ""

    def __create_log_entry_request(self, request, log_message):
        self.__refresh()
        timestamp = str(datetime.now())
        message = f"[{timestamp}] - {log_message}"
        if Constants.PASSWORD_KEY in request.keys():
            request[Constants.PASSWORD_KEY] = "*" * len(
                request.get(Constants.PASSWORD_KEY)
            )
        log_entry = {
            "timestamp": timestamp,
            "message": message,
            "type": "request",
            "request": request,
        }
        self.LOG["log"].append(log_entry)
        self.__dump()

    def __create_log_entry_response(self, response, log_message):
        self.__refresh()
        timestamp = str(datetime.now())
        message = f"[{timestamp}] - {log_message}"
        log_entry = {
            "timestamp": timestamp,
            "message": message,
            "type": "response",
            "response": response,
        }
        self.LOG["log"].append(log_entry)
        self.__dump()

    def __refresh(self):
        try:
            with open(self.dirname + self.logfile, "r") as infile:
                self.LOG = json.load(infile)
        except IOError as e:
            print(str(e))
        except Exception as e:
            print(str(e))

    def __dump(self):
        try:
            with open(self.dirname + self.logfile, "w+") as outfile:
                json.dump(self.LOG, outfile, indent=4)
        except IOError as e:
            print(str(e))
        except Exception as e:
            print(str(e))

    def log_request(self, request, resource, action):
        if resource == Logger.USERS:
            log_message = self.__log_user_request(request, action)
        if resource == Logger.MODELS:
            log_message = self.__log_model_request(request, action)
        if resource == Logger.INSTANCES:
            log_message = self.__log_instance_request(request, action)
        if resource == Logger.RACKS:
            log_message = self.__log_rack_request(request, action)

        self.__create_log_entry_request(request, log_message)

        return None

    def log_response(self, response):
        log_message = response.get("message")

        self.__create_log_entry_response(response, log_message)

        return None

    def get_logs(self):
        self.__refresh()

        return self.LOG


print(Actions.RACKS.CREATE)
