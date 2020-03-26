"""
Staggered retention 7 daily, 4 weekly, 12 monthly

"""

import json
import os
from datetime import datetime
from typing import Dict, List

import requests

##### DEFINE CONSTANTS

local_server = "http://localhost:4010/"
test_server = "https://parseltongue-finishinge-lfw68m.herokuapp.com/"
dev_server = "https://parseltongue-dev.herokuapp.com/"
prod_server = "https://parseltongue-prod.herokuapp.com/"
endpoint = "backups/getBackup"
password = "B@ckUpSist3ms!@"


##### DEFINE VARIABLES

server = dev_server
context = os.path.dirname(__file__)
url = server + endpoint
# backups_directory = f"{context}/backup_zips/"
backups_directory = "~/backups/"
# log_file = f"{context}/backup_zips/log.json"
log_file = "~/log.json"


##### DEFINE FUNCTIONS


def filename_to_datetime(filename: str):
    # 2020-03-24_01.26.15.604414.tar
    # return datetime.strptime(filename, "%Y-%m-%d_%H.%M.%S.%f.tar")
    return datetime.strptime(
        filename[0:10], "%Y-%m-%d"
    )  # Don't include seconds, minutes, hours so that the timedelta granularity is days


def remove_file(filename, path):
    try:
        os.remove(f"{path}/{filename}")
    except:
        print("something went wrong")


def fetch_and_store_backup():
    headers = {"passkey": password}
    response = requests.get(url, headers=headers, stream=True)
    filename = None

    if response.status_code == 200:
        filename = response.headers["filename"]
        with open(backups_directory + filename, "wb") as f:
            f.write(response.raw.read())

        update_log_file(
            timestamp=str(datetime.utcnow()),
            message="Successful backup",
            filename=filename,
        )

    if response.status_code == 403:
        update_log_file(
            timestamp=str(datetime.utcnow()),
            message="Authorization failed",
            filename=None,
        )

    return filename


def update_log_file(timestamp, message, filename):
    # pass
    try:
        with open(log_file, "r") as f:
            log = json.load(f)

        log["log"].append(
            {"timestamp": timestamp, "message": message, "filename": filename}
        )

        with open(log_file, "w+") as f:
            json.dump(log, f, indent=4)
    except:
        print("Failed to write to logfile")


##### INITIALIZE

if not os.path.exists(log_file):
    template: Dict[str, List[str]] = {"log": []}
    try:
        with open(log_file, "w+") as f:
            json.dump(template, f, indent=4)

    except:
        print("Failed to create log file")


##### FETCH AND STORE BACKUP
try:
    filename = fetch_and_store_backup()
except:
    update_log_file(
        timestamp=str(datetime.utcnow()),
        message="Backup failed, retrying",
        filename=None,
    )
    try:
        filename = fetch_and_store_backup()
    except:
        update_log_file(
            timestamp=str(datetime.utcnow()), message="Backup failed", filename=None
        )


##### STAGGER RETENTION

today_date = datetime.utcnow().date()
today = datetime.combine(today_date, datetime.min.time())

backups = os.listdir(backups_directory)
backups.sort(reverse=True)
# for backup in backups:
#     print(backup)
daily = 0
weekly = 0
monthly = 0

for backup in backups:
    try:
        backup_datetime = filename_to_datetime(backup)
    except:
        continue

    # print(backup)
    # print(f"today: {today}, backup: {backup_datetime}")
    dt = today - backup_datetime
    # print(dt)

    if dt.days == 0:
        if daily < 7:
            daily += 1
        else:
            remove_file(backup, backups_directory)

    if 0 < dt.days <= 7:
        if weekly < 4:
            weekly += 1
        else:
            remove_file(backup, backups_directory)

    if 7 < dt.days <= 30:
        if monthly < 12:
            monthly += 1
        else:
            remove_file(backup, backups_directory)

    if dt.days > 30:
        remove_file(backup, backups_directory)

    # print(f"daily: {daily}\nweekly: {weekly}\nmonthly: {monthly}")
