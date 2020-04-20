"""
Staggered retention 7 daily, 4 weekly, 12 monthly

Daily backups every day at 5am
Weekly backups every Wednesday at 5am
Monthly backups every 22nd day of the month at 5am

first Saturday is 4/18/2020
"""

import json
import os
import shutil
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

monthly_backup_day = 22


##### DEFINE VARIABLES


server = prod_server
# context = os.path.dirname(__file__)
context = "/home/hyposoft"
url = server + endpoint
# backups_directory = f"{context}/backup_zips/"
backups_directory = f"{context}/backups/"
backups_daily_dir = backups_directory + "daily/"
backups_weekly_dir = backups_directory + "weekly/"
backups_monthly_dir = backups_directory + "monthly/"
# log_file = f"{context}/backup_zips/log.json"
log_file = f"{context}/log.json"


##### DEFINE FUNCTIONS


def filename_to_datetime(filename: str):
    # 2020-03-24_01.26.15.604414.tar
    # return datetime.strptime(filename, "%Y-%m-%d_%H.%M.%S.%f.tar")
    return datetime.strptime(
        filename[0:10], "%Y-%m-%d"
    )  # Don't include seconds, minutes, hours so that the timedelta granularity is days


def remove_file(filename):
    try:
        os.remove(f"{filename}")
    except:
        print("something went wrong")


def fetch_and_store_backup():
    headers = {"passkey": password}
    response = requests.get(url, headers=headers, stream=True)
    filename = None
    print(response)

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


def add_and_update_backup_directory(new_file, directory, limit):
    backup_files = os.listdir(directory)
    backup_files.sort()
    while len(backup_files) >= limit:
        remove_file(directory + backup_files[0])
        del backup_files[0]

    shutil.copy(backups_directory + new_file, directory)


##### INITIALIZE

if not os.path.exists(log_file):
    template: Dict[str, List[str]] = {"log": []}
    try:
        with open(log_file, "w+") as f:
            json.dump(template, f, indent=4)

    except:
        print("Failed to create log file")


##### FETCH AND STORE BACKUP
filename = ""
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
first_saturday = filename_to_datetime("2020-04-15")
file_date = filename_to_datetime(filename)

is_daily = True
is_weekly = (file_date - first_saturday).days % 7 == 0
is_monthly = file_date.day == monthly_backup_day

if is_daily:
    # delete other same-day daily backups
    daily_backups = os.listdir(backups_daily_dir)
    for backup in daily_backups:
        if filename_to_datetime(backup) == file_date:
            remove_file(backups_daily_dir + backup)
    # delete old backups if necessary and copy new backup to directory
    add_and_update_backup_directory(filename, backups_daily_dir, 7)

if is_weekly:
    add_and_update_backup_directory(filename, backups_weekly_dir, 4)

if is_monthly:
    add_and_update_backup_directory(filename, backups_monthly_dir, 12)

remove_file(backups_directory + filename)


# print(f"daily: {daily}\nweekly: {weekly}\nmonthly: {monthly}")
