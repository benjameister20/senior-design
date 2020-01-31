from typing import List, Optional

from app.dal.database import db
from app.data_models.user import User


class UserEntry(db.Model):
    __tablename__ = "users"

    username = db.Column(db.String(80), primary_key=True, unique=True)
    password_hash = db.Column(db.String(80))
    display_name = db.Column(db.String(80))
    email = db.Column(db.String(80))

    def __init__(self, user: User):
        self.username = user.username
        self.password_hash = user.password
        self.display_name = user.display_name
        self.email = user.email


class UserTable:
    def get_user(self, username: str) -> Optional[User]:
        """ Get the user for the given username """
        user: UserEntry = UserEntry.query.filter_by(username=username).first()
        if user is None:
            return None

        return User(
            username=user.username,
            display_name=user.display_name,
            email=user.email,
            password=user.password_hash,
        )

    def get_user_by_email(self, email: str) -> Optional[User]:
        """ Get the user for the given username """
        user: UserEntry = UserEntry.query.filter_by(email=email).first()
        if user is None:
            return None

        return User(
            username=user.username,
            display_name=user.display_name,
            email=user.email,
            password=user.password_hash,
        )

    def add_user(self, user: User) -> None:
        """ Adds a user to the database """
        user_entry: UserEntry = UserEntry(user=user)

        try:
            db.session.add(user_entry)
            db.session.commit()
        except:
            print(f"Failed to add username {user.username}")

    def change_password(self, user: User, new_password: str) -> None:
        """ Update the user's password """
        try:
            UserEntry.query.filter_by(username=user.username).update(
                password_hash=new_password
            )
            db.session.commit()
        except:
            print(f"Failed to update password for {user.username}")

    def delete_user(self, user: User) -> None:
        """ Removes a user from the database """
        try:
            UserEntry.query.filter_by(username=user.username).delete()
            db.session.commit()
        except:
            print(f"Failed to delete username {user.username}")

    def get_all_users(self) -> List[User]:
        """ Get a list of all users """
        all_users: List[UserEntry] = UserEntry.query.all()

        return [
            User(
                username=entry.username,
                display_name=entry.display_name,
                email=entry.email,
                password=entry.password_hash,
            )
            for entry in all_users
        ]
