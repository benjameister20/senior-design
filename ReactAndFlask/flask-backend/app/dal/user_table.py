from typing import List, Optional

from app.dal.database import db
from app.data_models.user import User
from sqlalchemy import and_


class UserEntry(db.Model):
    __tablename__ = "users"

    username = db.Column(db.String(80), primary_key=True, unique=True)
    password_hash = db.Column(db.Binary(512))
    display_name = db.Column(db.String(80))
    email = db.Column(db.String(80))
    privilege = db.Column(db.String(80))

    def __init__(self, user: User):
        self.username = user.username
        self.password_hash = user.password
        self.display_name = user.display_name
        self.email = user.email
        self.privilege = user.privilege


class UserTable:
    def get_user(self, username: str) -> Optional[User]:
        """ Get the user for the given username """
        print(username)
        user: UserEntry = UserEntry.query.filter_by(username=username).first()
        if user is None:
            return None

        return User(
            username=user.username,
            display_name=user.display_name,
            email=user.email,
            password=user.password_hash,
            privilege=user.privilege,
        )

    def search_users(
        self,
        username: Optional[str],
        display_name: Optional[str],
        email: Optional[str],
        privilege: Optional[str],
        limit: int,
    ) -> List[User]:
        """ Get a list of all users matching the given criteria """
        criteria = []
        if username is not None and username != "":
            criteria.append(UserEntry.username == username)
        if display_name is not None and display_name != "":
            criteria.append(UserEntry.display_name == display_name)
        if email is not None and email != "":
            criteria.append(UserEntry.email == email)
        if privilege is not None and privilege != "":
            criteria.append(UserEntry.privilege == privilege)

        filtered_users: List[UserEntry] = UserEntry.query.filter(and_(*criteria)).limit(
            limit
        )

        return [
            User(
                username=user.username,
                display_name=user.display_name,
                email=user.email,
                password=user.password_hash,
                privilege=user.privilege,
            )
            for user in filtered_users
        ]

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
            privilege=user.privilege,
        )

    def add_user(self, user: User) -> None:
        """ Adds a user to the database """
        user_entry: UserEntry = UserEntry(user=user)

        try:
            db.session.add(user_entry)
            db.session.commit()
        except:
            print(f"Failed to add username {user.username}")
            raise

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
                privilege=entry.privilege,
            )
            for entry in all_users
        ]
