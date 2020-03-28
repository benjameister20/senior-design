# TODO: Fix whole log_syntax thing
# TODO: Finish log messages for models and racks
# TODO: Test logger
# TODO: Add power and network connections for assets
# TODO: Store messages as lists of strings to get newlines in messages in frontend

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


class DecommissionActions:
    DECOMMISSION = "DECOMMISSION"
    SEARCH = "SEARCH"


class ChangeplanActions:
    EXECUTE = "EXECUTE"


class Actions:
    USERS = UserActions()
    MODELS = ModelActions()
    INSTANCES = InstanceActions()
    RACKS = RackActions()
    DATACENTERS = DataCenterActions()
    DECOMMISSIONS = DecommissionActions()
    CHANGEPLAN = ChangeplanActions()


class Logger:

    MODELS = "models"
    INSTANCES = "assets"
    RACKS = "racks"
    USERS = "users"
    DATACENTERS = "datacenters"
    DECOMMISSIONS = "decommissions"
    CHANGEPLAN = "changeplan"
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

    def __log_user_request(self, action, request, username):

        if action == Logger.ACTIONS.USERS.CREATE:
            log_message = f"""CREATE User (Username: {request.get(Constants.USERNAME_KEY)}, Email: {request.get(Constants.EMAIL_KEY)}, Display Name: {request.get(Constants.DISPLAY_NAME_KEY)}, Privilege: {request.get(Constants.PRIVILEGE_KEY)})"""

        if action == Logger.ACTIONS.USERS.EDIT:
            log_message = f"""EDIT User (Username: {request.get(Constants.ORIGINAL_USERNAME_KEY)}) becomes (Username: {request.get(Constants.USERNAME_KEY)}, Email: {request.get(Constants.EMAIL_KEY)}, Display Name: {request.get(Constants.DISPLAY_NAME_KEY)}, Privilege: {request.get(Constants.PRIVILEGE_KEY)})"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.USERS.DELETE:
            log_message = (
                f"""DELETE User (Username: {request.get(Constants.USERNAME_KEY)})"""
            )
            # log_syntax = "DELETE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.AUTHENTICATE:
            log_message = f"""AUTHENTICATE User (Username: {request.get(Constants.USERNAME_KEY)})"""
            # log_syntax = "AUTHENTICATE user (<<username>>)"

        if action == Logger.ACTIONS.USERS.LOGOUT:
            log_message = f"""LOGOUT User (Username: {username})"""
            # log_syntax = "LOGOUT user (<<username>>)"

        if action == Logger.ACTIONS.USERS.OAUTH:
            log_message = (
                f"""OAUTH User (Username: {request.get(Constants.USERNAME_KEY)})"""
            )
            # log_syntax = "OAUTH user (<<username>>)"

        return log_message

    def __log_instance_request(self, action, request):

        if action == Logger.ACTIONS.INSTANCES.CREATE:
            log_message = f"""CREATE Asset (Asset Number: {request.get(Constants.ASSET_NUMBER_KEY)}, Model Name: {request.get(Constants.MODEL_KEY)}>>, Datacenter Name: {request.get(Constants.DC_NAME_KEY)}, Hostname: {request.get(Constants.HOSTNAME_KEY)}, Rack: {request.get(Constants.RACK_KEY)}, Rack Position: {request.get(Constants.RACK_POSITION_KEY)}, Owner: {request.get(Constants.OWNER_KEY)}, Comment: {request.get(Constants.COMMENT_KEY)}, Network Connections: {json.dumps(request.get(Constants.NETWORK_CONNECTIONS_KEY))}, Power Connections: {json.dumps(request.get(Constants.POWER_CONNECTIONS_KEY))})"""
            # log_syntax = """CREATE instance (
            #     <<model_name>>, <<email>>, <<display_name>>, <<privilege>>)"""

        if action == Logger.ACTIONS.INSTANCES.EDIT:
            log_message = f"""EDIT Asset (Asset Number: {request.get(Constants.ASSET_NUMBER_ORIG_KEY)}) becomes (Asset Number: {request.get(Constants.ASSET_NUMBER_KEY)}, Model Name: {request.get(Constants.MODEL_KEY)}>>, Datacenter Name: {request.get(Constants.DC_NAME_KEY)}, Hostname: {request.get(Constants.HOSTNAME_KEY)}, Rack: {request.get(Constants.RACK_KEY)}, Rack Position: {request.get(Constants.RACK_POSITION_KEY)}, Owner: {request.get(Constants.OWNER_KEY)}, Comment: {request.get(Constants.COMMENT_KEY)}, Network Connections: {json.dumps(request.get(Constants.NETWORK_CONNECTIONS_KEY))}, Power Connections: {json.dumps(request.get(Constants.POWER_CONNECTIONS_KEY))})"""
            # log_syntax = "EDIT instance (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.INSTANCES.DELETE:
            log_message = f"""DELETE Asset (Asset Number: {request.get(Constants.ASSET_NUMBER_KEY)})"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_model_request(self, action, request):
        print(json.dumps(request, indent=4))
        if action == Logger.ACTIONS.MODELS.CREATE:
            log_message = f"""CREATE Model (Vendor: {request.get(Constants.VENDOR_KEY)}, Model Number: {request.get(Constants.MODEL_NUMBER_KEY)}, Height: {request.get(Constants.HEIGHT_KEY)}, Display Color: {request.get(Constants.DISPLAY_COLOR_KEY)}, Ethernet Ports: {request.get(Constants.ETHERNET_PORT_KEY)}, Power Ports: {request.get(Constants.POWER_PORT_KEY)}, CPU: {request.get(Constants.CPU_KEY)}, Memory: {request.get(Constants.MEMORY_KEY)}, Storage: {request.get(Constants.STORAGE_KEY)}, Comment: {request.get(Constants.COMMENT_KEY)})"""
            # log_syntax = "CREATE user (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.EDIT:
            log_message = f"""EDIT Model (Vendor: {request.get(Constants.VENDOR_ORIG_KEY)}, Model Number: {request.get(Constants.MODEL_NUMBER_ORIG_KEY)}) becomes: (Vendor: {request.get(Constants.VENDOR_KEY)}, Model Number: {request.get(Constants.MODEL_NUMBER_KEY)}, Height: {request.get(Constants.HEIGHT_KEY)}, Display Color: {request.get(Constants.DISPLAY_COLOR_KEY)}, Ethernet Ports: {request.get(Constants.ETHERNET_PORT_KEY)}, Power Ports: {request.get(Constants.POWER_PORT_KEY)}, CPU: {request.get(Constants.CPU_KEY)}, Memory: {request.get(Constants.MEMORY_KEY)}, Storage: {request.get(Constants.STORAGE_KEY)}, Comment: {request.get(Constants.COMMENT_KEY)})"""
            # log_syntax = "EDIT user (<<old_username>>) to (<<username>>, <<email>>, <<display_name>>, <<privilege>>)"

        if action == Logger.ACTIONS.MODELS.DELETE:
            log_message = f"""DELETE Model (Vendor: {request.get(Constants.VENDOR_KEY)}, Model Number: {request.get(Constants.MODEL_NUMBER_KEY)})"""
            # log_syntax = "DELETE user (<<username>>)"

        return log_message

    def __log_rack_request(self, action, request):
        if action == Logger.ACTIONS.RACKS.CREATE:
            log_message = f"""CREATE Rack range {request.get(Constants.START_LETTER_KEY)}-{request.get(Constants.STOP_LETTER_KEY)}, {request.get(Constants.START_NUMBER_KEY)}-{request.get(Constants.STOP_NUMBER_KEY)} in Datacenter {request.get(Constants.DC_NAME_KEY)}"""

        if action == Logger.ACTIONS.RACKS.DELETE:
            log_message = f"""CREATE Rack range {request.get(Constants.START_LETTER_KEY)}-{request.get(Constants.STOP_LETTER_KEY)}, {request.get(Constants.START_NUMBER_KEY)}-{request.get(Constants.STOP_NUMBER_KEY)} from Datacenter {request.get(Constants.DC_NAME_KEY)}"""

        return log_message

    def __log_datacenter_request(self, action, request):

        if action == Logger.ACTIONS.DATACENTERS.CREATE:
            log_message = f"""CREATE Datacenter (Name: {request.get(Constants.DC_NAME_KEY)}, Abbreviation: {request.get(Constants.DC_ABRV_KEY)})"""

        if action == Logger.ACTIONS.DATACENTERS.DELETE:
            log_message = f"""DELETE Datacenter (Name: {request.get(Constants.DC_NAME_KEY)}, Abbreviation: {request.get(Constants.DC_ABRV_KEY)})"""

        if action == Logger.ACTIONS.DATACENTERS.EDIT:
            log_message = f"""EDIT Datacenter (Name: {request.get(Constants.NAME_ORIG_KEY)}) to (Name: {request.get(Constants.DC_NAME_KEY)}, Abbreviation: {request.get(Constants.DC_ABRV_KEY)})"""

        return log_message

    def __log_decommission_request(self, action, request):
        if action == Logger.ACTIONS.DECOMMISSIONS.DECOMMISSION:
            log_message = f"""DECOMMISSION Asset (Asset Number: {request.get(Constants.ASSET_NUMBER_KEY)})"""

        return log_message

    def __log_changeplan_request(self, action, request):
        if action == Logger.ACTIONS.CHANGEPLAN.EXECUTE:
            log_message = f"""EXECUTE Changeplan (Changeplan ID: {request.get(Constants.CHANGE_PLAN_ID_KEY)})"""

        return log_message

    def __create_log_entry_request(
        self, request, resource, log_message, username, action
    ):
        self.__refresh()
        timestamp = str(datetime.now())
        # message = f"[{timestamp}] {user} - {log_message}"
        message = f"[{username}] - {log_message}"

        if request is not None:
            request_copy = dict(request)
        else:
            request_copy = {"username": username}

        if Constants.PASSWORD_KEY in request_copy.keys():
            request_copy[Constants.PASSWORD_KEY] = "*" * 12
        log_entry = {
            "timestamp": timestamp,
            "user": username,
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

    def log_request(self, request, resource, action, username):
        # print("resource")
        # print(resource)
        # print("request")
        # print(request)
        # print("action")
        # print(action)
        # print("username")
        # print("username")

        if resource == Logger.USERS:
            log_message = self.__log_user_request(action, request, username)
        if resource == Logger.MODELS:
            log_message = self.__log_model_request(action, request)
        if resource == Logger.INSTANCES:
            log_message = self.__log_instance_request(action, request)
        if resource == Logger.RACKS:
            log_message = self.__log_rack_request(action, request)
        if resource == Logger.DATACENTERS:
            log_message = self.__log_datacenter_request(action, request)
        if resource == Logger.DECOMMISSIONS:
            log_message = self.__log_decommission_request(action, request)
        if resource == Logger.CHANGEPLAN:
            log_message = self.__log_changeplan_request(action, request)

        self.__create_log_entry_request(
            request, resource, log_message, username, action
        )

        return None

    def log_response(self, response):
        log_message = response.get("message")

        self.__create_log_entry_response(response, log_message)

        return None

    def get_logs(self):
        self.__refresh()

        return self.LOG
