import json
import os
from datetime import datetime


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
    EDIT = "EDIT"
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
        log_message = str(datetime.now()) + log_message

        return None

    def __create_log_entry(self):

        pass

    def __log_user_request(self, action):
        if action == Actions.USERS.CREATE:
            pass
        if action == Actions.USERS.EDIT:
            pass
        if action == Actions.USERS.DELETE:
            pass
        if action == Actions.USERS.AUTHENTICATE:
            pass
        if action == Actions.USERS.LOGOUT:
            pass
        if action == Actions.USERS.OAUTH:
            pass

        return

    def __log_instance_request(self, action):
        pass

    def __log_model_request(self, action):
        pass

    def __log_rack_request(self, action):
        pass

    def __refresh(self):
        with open(self.dirname + self.logfile, "r") as infile:
            self.LOG = json.load(infile)

    def __dump(self):
        with open(self.dirname + self.logfile, "w+") as outfile:
            json.dump(self.LOG, outfile, indent=4)

    def log_request(self, request, resource, action):
        self.__refresh()
        if resource == Logger.USERS:
            self.__log_user_request(request)
        if resource == Logger.MODELS:
            self.__log_model_request(request)
        if resource == Logger.INSTANCES:
            self.__log_instance_request(request)
        if resource == Logger.RACKS:
            self.__log_rack_request(request)

    def log_response(self, response):
        self.__refresh()


print(Actions.RACKS.CREATE)
