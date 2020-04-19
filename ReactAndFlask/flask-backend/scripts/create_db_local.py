""" A script to create the databases """

import os  # isort:skip
import sys  # isort:skip

# Add root directory to Python path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)  # isort:skip

from application import application, init  # isort:skip
from app.dal.database import db
from app.dal.datacenter_table import DatacenterEntry  # noqa
from app.dal.instance_table import InstanceEntry  # noqa
from app.dal.model_table import ModelEntry  # noqa
from app.dal.model_table import ModelTable
from app.dal.rack_table import RackEntry  # noqa
from app.dal.user_table import UserEntry, UserTable  # noqa
from app.data_models.model import Model
from app.data_models.permission import Permission
from app.data_models.user import User
from app.users.authentication import AuthManager

application.debug = True  # isort:skip
init()  # isort:skip


# Create all tables
with application.app_context():
    db.drop_all()
    db.create_all()
    db.session.commit()

    # Admin user
    encrypted_password = AuthManager().encrypt_pw(password="P8ssw0rd1!@")
    datacenters = ["*"]
    priv: Permission = Permission(
        model=True,
        asset=True,
        datacenters=datacenters,
        power=True,
        audit=True,
        admin=True,
    )
    user: User = User(
        username="admin",
        display_name="Admin",
        email="admin@email.com",
        password=encrypted_password,
        privilege=priv.make_json(),
        datacenters=datacenters,
    )
    UserTable().add_user(user=user)

    # Basic user
    encrypted_password = AuthManager().encrypt_pw(password="Basic7#")
    datacenters = []
    basic_priv: Permission = Permission(
        model=False,
        asset=False,
        datacenters=datacenters,
        power=False,
        audit=False,
        admin=False,
    )
    basic_user: User = User(
        username="basic",
        display_name="Basic",
        email="basic@email.com",
        password=encrypted_password,
        privilege=basic_priv.make_json(),
        datacenters=datacenters,
    )
    UserTable().add_user(user=basic_user)

    # Models user
    encrypted_password = AuthManager().encrypt_pw(password="Models8!")
    datacenters = []
    models_priv: Permission = Permission(
        model=True,
        asset=False,
        datacenters=datacenters,
        power=False,
        audit=False,
        admin=False,
    )
    models_user: User = User(
        username="models",
        display_name="Models",
        email="models@email.com",
        password=encrypted_password,
        privilege=models_priv.make_json(),
        datacenters=datacenters,
    )
    UserTable().add_user(user=models_user)

    model: Model = Model(
        vendor="dell", model_number="1234", mount_type="rackmount", height=3
    )
    ModelTable().add_model(model=model)
