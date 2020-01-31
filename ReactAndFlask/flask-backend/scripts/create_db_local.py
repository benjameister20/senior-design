""" A script to create the databases """

import os  # isort:skip
import sys  # isort:skip

# Add root directory to Python path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)  # isort:skip

from application import application, init  # isort:skip

application.debug = True  # isort:skip
init()  # isort:skip

from app.dal.database import db
from app.dal.instance_table import InstanceEntry  # noqa
from app.dal.model_table import ModelEntry  # noqa
from app.dal.rack_table import RackEntry  # noqa
from app.dal.user_table import UserEntry  # noqa

# Create all tables
with application.app_context():
    db.create_all()
    db.session.commit()