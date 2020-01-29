""" A script to create the databases """

import os  # isort:skip
import sys  # isort:skip

# Add root directory to Python path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)  # isort:skip

from application import application  # isort:skip

application.debug = True  # isort:skip

from app.dal.database import db
from app.dal.instance_table import InstanceEntry  # noqa
from app.dal.rack_table import RackEntry  # noqa
from app.dal.user_table import UserEntry  # noqa

# Create all tables
try:
    db.create_all()
    db.session.commit()
except:
    print("Creating tables failed")
