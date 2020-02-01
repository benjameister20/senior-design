""" A script to manage users in the database """

import os  # isort:skip
import sys  # isort:skip

# Add root directory to Python path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)  # isort:skip

from application import application, init  # isort:skip

from typing import List, Optional

from app.dal.user_table import UserTable
from app.data_models.user import User


class InvalidInputException(Exception):
    """
    Raised when the input given is invalid
    """


user_table = UserTable()


def main():
    print("User Management")
    print()

    while True:
        print("1 - Add user")
        print("2 - Get user")
        print("3 - Get all users")
        print("q - exit")
        print()

        user_input: str = input("Select operation: ")
        if user_input == "q":
            return

        try:
            input_num: int = int(user_input)

            if input_num < 1 or input_num > 3:
                raise InvalidInputException

            if input_num == 1:
                create_user()
            elif input_num == 2:
                find_user()
            elif input_num == 3:
                find_all_users()
        except InvalidInputException:
            print("Please enter a valid number")
            print()
        except:
            raise


def create_user():
    print("Please enter new user information")
    print()

    username: str = input("Username: ")
    password: str = input("Password: ")
    display_name: str = input("Display name: ")
    email: str = input("Email: ")
    privilege: str = input("Privilege: ")

    user: User = User(
        username=username,
        display_name=display_name,
        email=email,
        password=password,
        privilege=privilege,
    )

    user_table.add_user(user=user)

    print()


def find_user():
    print("Please enter username")
    print()

    username: str = input("Username: ")

    user: Optional[User] = user_table.get_user(username=username)
    if user is not None:
        print()
        print("Result:")
        print()
        print(user)
    else:
        print(f"No user found with username {username}!")


def find_all_users():
    users: List[User] = user_table.get_all_users()

    print()
    print("Result:")
    print()
    for user in users:
        print(user)
        print()


if __name__ == "__main__":
    with application.app_context():
        application.debug = True
        init()
        main()
