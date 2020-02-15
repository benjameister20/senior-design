import json
import os
from datetime import datetime


class LoggerConstants:
    MODELS = "model"
    INSTANCES = "asset"
    RACKS = "rack"


class Logger:
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

    def __log_create(self, blueprint):
        f"Create {blueprint}"

    def __log_edit(self, blueprint):
        pass

    def __log_delete(self, blueprint):
        pass

    def __refresh(self):
        with open(self.dirname + self.logfile, "r") as infile:
            self.LOG = json.load(infile)

    def __dump(self):
        with open(self.dirname + self.logfile, "w+") as outfile:
            json.dump(self.LOG, outfile, indent=4)

    def log_request(self):
        pass

    def log_response(self):
        pass


print(LoggerConstants.INSTANCES)
