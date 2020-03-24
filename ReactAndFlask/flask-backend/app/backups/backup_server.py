"""
Staggered retention 7 daily, 4 weekly, 12 monthly

records.json

"""

import os
from datetime import datetime
from typing import Dict

import requests

##### DEFINE CONSTANTS
local_server = "http://localhost:4010/"
test_server = "https://parseltongue-finishinge-lfw68m.herokuapp.com/"
dev_server = "https://parseltongue-dev.herokuapp.com/"
prod_server = "https://parseltongue-prod.herokuapp.com/"
endpoint = "backups/getBackup"

##### DEFINE VARIABLES

url = local_server + endpoint

backups_directory = f"{os.path.dirname(__file__)}/backup_zips/"
# backups_directory = "~/backups/"

records: Dict[str, str] = {}

##### FETCH BACKUP
response = requests.get(url, stream=True)
print(response.headers)

filename = response.headers["filename"]
dt: str = response.headers["Date"]  # Tue, 24 Mar 2020 01:26:15 GMT
print(type(dt))
timestamp: datetime = datetime.strptime(dt, "%a, %d %b %Y %H:%M:%S %Z")


##### RECORD BACKUP WITH STAGGERED RETENTION


if response.status_code == 200:
    with open(backups_directory + filename, "wb") as f:
        f.write(response.raw.read())


##### STAGGERED RETENTION
