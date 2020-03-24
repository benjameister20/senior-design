import os
from datetime import datetime

from app.constants import Constants
from app.exceptions.BackupExceptions import BackupError


class BackupsManager:

    FILE_PATH = os.path.dirname(__file__)

    def __init__(self):
        pass

    def generate_backup(self):
        command = f"pg_dump {Constants.BACKUPS_DB} -O -F t > "
        utc_time = datetime.utcnow()
        filename = str(utc_time) + ".tar"
        date, time = filename.split(" ")
        filename = filename.replace(" ", "_")
        filename = filename.replace(":", ".")
        full_name = f"{BackupsManager.FILE_PATH}/backup_zips/{filename}"

        file_data = {}
        file_data["file_path"] = full_name
        file_data["filename"] = filename
        file_data["date"] = date
        file_data["time"] = time
        file_data["datetime"] = utc_time

        try:
            os.system(command + full_name)
        except IOError:
            raise BackupError("Failed to backup Postgres database")
        except:
            raise BackupError("Failed to create backup")

        return file_data

    def restore_from_backup(self, filename):
        file_path = f"{BackupsManager.FILE_PATH}/backup_zips/{filename}"
        command = f"pg_restore {file_path} -c -d {Constants.BACKUPS_DB} -F t"

        try:
            os.system(command)
        except IOError:
            raise BackupError("Failed to backup Postgres database")
        except:
            raise BackupError("Failed to create backup")

    def list_backups(self):
        pass
