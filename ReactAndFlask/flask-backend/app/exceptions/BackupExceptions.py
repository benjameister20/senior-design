class BackupError(Exception):
    def __init__(self, message):
        self.message = message


class EmailUpdateError(Exception):
    def __init__(self, message):
        self.message = message
