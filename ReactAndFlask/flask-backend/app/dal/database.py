from application import application
from flask_sqlalchemy import SQLAlchemy

application.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://localhost/test"
db = SQLAlchemy(app=application)
