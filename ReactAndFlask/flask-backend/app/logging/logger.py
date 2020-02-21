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


class DataCenterActions:
    CREATE = "CREATE"
    DELETE = "DELETE"
    EDIT = "EDIT"


class Actions:
    USERS = UserActions()
    MODELS = ModelActions()
    INSTANCES = InstanceActions()
    RACKS = RackActions()
    DATACENTERS = DataCenterActions()


class Logger:

    MODELS = "models"
    INSTANCES = "assets"
    RACKS = "racks"
    USERS = "users"
    DATACENTERS = "datacenters"
    ACTIONS = Actions()

    def __init__(self):
        self.logfile = "/app.log"
        self.dirname = os.path.dirname(__file__)
        self.LOG = {}
        logfile_template = {"log": []}
        logfile_exists = os.path.exists(self.dirname + self.logfile)
        if not logfile_exists:
            with open(self.dirname + self.logfile, "w") as lf:
                json.dump(logfile_template, lf, indent=4)

        with open(self.dirname + self.logfile, "r") as infile:
            self.LOG = json.load(infile)

    @staticmethod
    def __add_timestamp(log_message):
        log_message = f"[{str(datetime.now())}] {log_message}"

        return log_message

    def __log_user_request(self, action):

        if action == Logger.ACTIONS.USERS.CREATE:
            log_message = f"""CREATE User (Username: <<{Constants.USERNAME_KEY}>>, Email: <<{Constants.EMAIL_KEY}>>, Display Name: <<{Constants.DISPLAY_NAME_KEY}>>, Privilege: <<{Constants.PRIVILEGE_KEY}>>)"""

        if action == Logger.ACTIONS.USERS.EDIT:
            log_message = f"""EDIT User (Username: <<{Constants.OLD_USERNAME_KEY}>>) becomes (Username: <<{Constants.USERNAME_KEY}>>, Email: <<{Constants.EMAIL_KEY}>>, Display Name: <<{Constants.DISPLAY_NAME_KEY}>>, Privilege: <<{Constants.PRIVILEGE_KEY}>>)"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.USERS.DELETE:
            log_message = f"""DELETE User (Username: <<{Constants.USERNAME_KEY}>>)"""
            # log_syntax = "DELETE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.AUTHENTICATE:
            log_message = (
                f"""AUTHENTICATE User (Username: <<{Constants.USERNAME_KEY}>>)"""
            )
            # log_syntax = "AUTHENTICATE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.LOGOUT:
            log_message = f"""LOGOUT User (Username: <<{Constants.USERNAME_KEY}>>)"""
            # log_syntax = "LOGOUT user (<<username>>)"

        if action == Logger.ACTIONS.USERS.OAUTH:
            log_message = f"""OAUTH User (Username: <<{Constants.USERNAME_KEY}>>)"""
            # log_syntax = "OAUTH user (<<username>>)"

        return log_message

    def __log_instance_request(self, action):

        if action == Logger.ACTIONS.INSTANCES.CREATE:
            log_message = f"""CREATE Asset (Model Name: <<{Constants.MODEL_KEY}>>, Datacenter Name: <<{Constants.DC_NAME_KEY}>>, Hostname: <<{Constants.HOSTNAME_KEY}>>, Rack: <<{Constants.RACK_KEY}>>, Rack Position: <<{Constants.RACK_POSITION_KEY}>>, Owner: <<{Constants.OWNER_KEY}>>, Comment: <<{Constants.COMMENT_KEY}>>, MAC Address: <<{Constants.MAC_ADDRESS_KEY}>>, Asset Number: <<{Constants.ASSET_NUMBER_KEY}>>)"""
            # log_syntax = """CREATE instance (
            #     <<model_name>>, <<email>>, <<display_name>>, <<privilege>>)"""

        if action == Logger.ACTIONS.INSTANCES.EDIT:
            log_message = f"""EDIT Asset (Model Name: <<{Constants.MODEL_KEY}>>, Datacenter Name: <<{Constants.DC_NAME_KEY}>>, Hostname: <<{Constants.HOSTNAME_KEY}>>, Rack: <<{Constants.RACK_KEY}>>, Rack Position: <<{Constants.RACK_POSITION_KEY}>>, Owner: <<{Constants.OWNER_KEY}>>, Comment: <<{Constants.COMMENT_KEY}>>, MAC Address: <<{Constants.MAC_ADDRESS_KEY}>>, Asset Number: <<{Constants.ASSET_NUMBER_KEY}>>)"""
            # log_syntax = "EDIT instance (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.INSTANCES.DELETE:
            log_message = f"""DELETE Asset (Model Name: <<{Constants.MODEL_KEY}>>, Datacenter Name: <<{Constants.DC_NAME_KEY}>>, Hostname: <<{Constants.HOSTNAME_KEY}>>)"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_model_request(self, action):
        if action == Logger.ACTIONS.MODELS.CREATE:
            log_message = f"""CREATE Model (Vendor: <<{Constants.VENDOR_KEY}>>, Model Number: <<{Constants.MODEL_NUMBER_KEY}>>, Height: <<{Constants.HEIGHT_KEY}>>, Display Color: <<{Constants.DISPLAY_COLOR_KEY}>>, Ethernet Ports: <<{Constants.ETHERNET_PORT_KEY}>>, Power Ports: <<{Constants.POWER_PORT_KEY}>>, CPU: <<{Constants.CPU_KEY}>>, Memory: <<{Constants.MEMORY_KEY}>>, Storage: <<{Constants.STORAGE_KEY}>>, Comment: <<{Constants.COMMENT_KEY}>>)"""
            # log_syntax = "CREATE user (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.EDIT:
            log_message = f"""EDIT Model (Vendor: <<{Constants.VENDOR_KEY}>>, Model Number: <<{Constants.MODEL_NUMBER_KEY}>>) becomes: (Vendor: <<{Constants.VENDOR_KEY}>>, Model Number: <<{Constants.MODEL_NUMBER_KEY}>>, Height: <<{Constants.HEIGHT_KEY}>>, Display Color: <<{Constants.DISPLAY_COLOR_KEY}>>, Ethernet Ports: <<{Constants.ETHERNET_PORT_KEY}>>, Power Ports: <<{Constants.POWER_PORT_KEY}>>, CPU: <<{Constants.CPU_KEY}>>, Memory: <<{Constants.MEMORY_KEY}>>, Storage: <<{Constants.STORAGE_KEY}>>, Comment: <<{Constants.COMMENT_KEY}>>)"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.DELETE:
            log_message = f"""DELETE Model (Vendor: <<{Constants.VENDOR_KEY}>>, Model Number: <<{Constants.MODEL_NUMBER_KEY}>>)"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_rack_request(self, action):
        if action == Logger.ACTIONS.RACKS.CREATE:
            log_message = f"""CREATE Rack range <<{Constants.START_LETTER_KEY}>>-<<{Constants.STOP_LETTER_KEY}>>, <<{Constants.START_NUMBER_KEY}>>-<<{Constants.STOP_NUMBER_KEY}>> in Datacenter <<{Constants.DC_NAME_KEY}>>"""

        if action == Logger.ACTIONS.RACKS.DELETE:
            log_message = f"""CREATE Rack range <<{Constants.START_LETTER_KEY}>>-<<{Constants.STOP_LETTER_KEY}>>, <<{Constants.START_NUMBER_KEY}>>-<<{Constants.STOP_NUMBER_KEY}>> from Datacenter <<{Constants.DC_NAME_KEY}>>"""

        return log_message

    def __log_datacenter_request(self, action):

        if action == Logger.ACTIONS.DATACENTERS.CREATE:
            log_message = f"""CREATE Datacenter (Name: {Constants.DC_NAME_KEY}, Abbreviation: {Constants.DC_ABRV_KEY})"""

        if action == Logger.ACTIONS.DATACENTERS.DELETE:
            log_message = f"""DELETE Datacenter (Name: {Constants.DC_NAME_KEY}, Abbreviation: {Constants.DC_ABRV_KEY})"""

        if action == Logger.ACTIONS.DATACENTERS.EDIT:
            log_message = f"""EDIT Datacenter (Name: {Constants.NAME_ORIG_KEY}) to (Name: {Constants.DC_NAME_KEY}, Abbreviation: {Constants.DC_ABRV_KEY})"""

        return log_message

    def __create_log_entry_request(self, request, resource, log_message, user, action):
        self.__refresh()
        timestamp = str(datetime.now())
        # message = f"[{timestamp}] {user} - {log_message}"
        message = f"[{user}] - {log_message}"
        request_copy = dict(request)
        if Constants.PASSWORD_KEY in request_copy.keys():
            request_copy[Constants.PASSWORD_KEY] = "*" * 12
        log_entry = {
            "timestamp": timestamp,
            "user": user,
            "action": action,
            "message": message,
            "resource": resource,
            "type": "request",
            "request": request_copy,
        }
        self.LOG["log"].append(log_entry)
        self.__dump()

    def __create_log_entry_response(self, response, log_message):
        self.__refresh()
        timestamp = str(datetime.now())
        # message = f"[{timestamp}] - {log_message}"
        log_entry = {
            "timestamp": timestamp,
            "message": log_message,
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

    def log_request(self, request, resource, action, user):
        if resource == Logger.USERS:
            log_message = self.__log_user_request(action)
        if resource == Logger.MODELS:
            log_message = self.__log_model_request(action)
        if resource == Logger.INSTANCES:
            log_message = self.__log_instance_request(action)
        if resource == Logger.RACKS:
            log_message = self.__log_rack_request(action)

        self.__create_log_entry_request(request, resource, log_message, user, action)

        return None

    def log_response(self, response):
        log_message = response.get("message")

        self.__create_log_entry_response(response, log_message)

        return None

    def get_logs(self):
        self.__refresh()

        return self.LOG
