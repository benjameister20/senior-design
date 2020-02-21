import json
import os

import requests
from app.dal.user_table import UserTable
from app.data_models.user import User
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.exceptions.UserExceptions import (
    IncorrectPasswordError,
    InvalidPrivilegeError,
    InvalidUsernameError,
    NonexistantUserError,
    UserException,
    UsernameTakenError,
)
from app.users.authentication import AuthManager
from app.users.validator import Validator

# self.AUTH_MANAGER = AuthManager()
# self.VALIDATOR = Validator()
# self.USER_TABLE = UserTable()

blacklist_file = "/token_blacklist.json"
dirname = os.path.dirname(__file__)
# self.BLACKLIST = []
# with open(dirname + blacklist_file, "r") as infile:
#     contents = json.load(infile)
#     self.BLACKLIST = contents.get("blacklist")


class UserManager:
    def __init__(self):
        self.AUTH_MANAGER = AuthManager()
        self.VALIDATOR = Validator()
        self.USER_TABLE = UserTable()
        self.BLACKLIST = []
        with open(dirname + blacklist_file, "r") as infile:
            contents = json.load(infile)
            self.BLACKLIST = contents.get("blacklist")

    @staticmethod
    def __add_message_to_JSON(json, message) -> dict:
        json["message"] = message

        return json

    @staticmethod
    def __make_user_from_json(json) -> User:
        return User(
            username=json.get("username"),
            display_name=json.get("display_name"),
            email=json.get("email"),
            password=json.get("password"),
            privilege=json.get("privilege"),
        )

    @staticmethod
    def __match_oauth(request, response):
        # print(request)
        # print("RESPONSE")
        # print(json.dumps(response, indent=4))
        usernames_match = request.get("username") == response.get("netid")
        display_names_match = request.get("display_name") == response.get("displayName")
        emails_match = request.get("email") == response.get("mail")

        return usernames_match and display_names_match and emails_match

    def search(self, request):
        request_data = request.get_json()
        filters = request_data.get("filter")
        limit = filters.get("limit")
        if limit is None:
            limit = 1000

        users = self.USER_TABLE.search_users(
            username=filters.get("username"),
            display_name=filters.get("display_name"),
            email=filters.get("email"),
            privilege=filters.get("privilege"),
            limit=limit,
        )

        json_list = [user.make_json() for user in users]

        return json_list

    def create_user(self, request):
        """Route for creating users

        Username Criteria:
        - Between 4 and 20 characters
        - Contains only alphanumeric characters and ".", "_"
        - No "." or "_" at the beginning
        - No doubles of special characters (".." or "__")
        - Not already taken by another user

        Email Criteria:
        - Valid email address compliant with RCF 5322 standard
        - Not already associated with another account

        Password Criteria:
        - Contains at least one number.
        - Contains at least one uppercase and one lowercase character.
        - Contains at least one special symbol.
        - Between 8 to 20 characters long.


        Returns:
            string: Success or failure, if failure provide message
        """

        response = {}

        request_data = request.get_json()
        try:
            username = request_data.get("username")
            password = request_data.get("password")
            email = request_data.get("email")
            display_name = request_data.get("display_name")
            privilege = request_data.get("privilege")
        except:
            raise InvalidInputsError(
                "Incorrectly formatted message. Application error on the frontend"
            )

        try:
            user = self.__make_user_from_json(request_data)
            self.VALIDATOR.validate_create_user(user)
        except UserException as e:
            raise UserException(e.message)
        except:
            raise UserException("Could not create user")

        try:
            encrypted_password = self.AUTH_MANAGER.encrypt_pw(password)

            user = User(username, display_name, email, encrypted_password, privilege)
            self.USER_TABLE.add_user(user)
        except:
            raise UserException("Could not create user")

        return self.__add_message_to_JSON(response, "success")

    def delete(self, request):
        """Route for deleting users

        Returns:
            string: Success or failure, if failure provide message
        """

        response = {}

        request_data = request.get_json()
        print("request data")
        print(request_data)
        username = request_data["username"]

        user = self.USER_TABLE.get_user(username)

        try:
            self.VALIDATOR.validate_delete_user(user)
        except UserException as e:
            return self.__add_message_to_JSON(response, e.message)
        except Exception as e:
            print(e)
            return self.__add_message_to_JSON(
                response, f"User '{username}' does not exist"
            )

        self.USER_TABLE.delete_user(user)

        return self.__add_message_to_JSON(response, "Success")

    def edit(self, request):

        response = {}

        request_data = request.get_json()
        print("request:")
        print(request_data)
        username_original = request_data.get("username_original")
        request_data.get("username")
        request_data.get("email")
        request_data.get("display_name")
        request_data.get("privilege")

        old_user = None
        try:
            user = self.__make_user_from_json(request_data)
            updated_user, old_user = self.VALIDATOR.validate_edit_user(
                user, username_original
            )
        except UserException as e:
            raise UserException(e.message)
        except Exception as e:
            print(e)
            raise UserException("Could not edit user")

        # old_user = self.USER_TABLE.get_user(username_original)
        # updated_user = User(
        #     username=username,
        #     display_name=display_name,
        #     email=email,
        #     password=old_user.password,
        #     privilege=privilege,
        # )
        self.USER_TABLE.delete_user(old_user)
        self.USER_TABLE.add_user(updated_user)

        if old_user.privilege == "admin" and updated_user.privilege != "admin":
            return self.__add_message_to_JSON(
                response,
                f"Success, Demotion to user privilege will take effect within the next {self.AUTH_MANAGER.TOKEN_EXP_DAYS} Days, {self.AUTH_MANAGER.TOKEN_EXP_HOURS} Hours, {self.AUTH_MANAGER.TOKEN_EXP_MINUTES} Minutes, and {self.AUTH_MANAGER.TOKEN_EXP_SECONDS} Seconds.",
            )

        return self.__add_message_to_JSON(response, "Success")

    def authenticate(self, request):
        # TESTED AND FUNCTIONAL
        """ Route for authenticating users """

        answer = {}

        request_data = request.get_json()
        username = request_data.get("username")
        attempted_password = request_data.get("password")

        user = self.USER_TABLE.get_user(username)
        if user is None:
            raise NonexistantUserError(f"User '{username}' does not exist")

        auth_success = self.AUTH_MANAGER.compare_pw(attempted_password, user.password)
        if not auth_success:
            raise IncorrectPasswordError("Incorrect password")

        answer["token"] = self.AUTH_MANAGER.encode_auth_token(username)
        answer["privilege"] = user.privilege

        return self.__add_message_to_JSON(answer, "success")

    def logout(self, request):
        global dirname
        global blacklist_file

        response = {}

        token = request.headers.get("token")
        self.BLACKLIST.append(token)
        # print(self.BLACKLIST)

        with open(dirname + blacklist_file, "w") as outfile:
            json.dump({"blacklist": self.BLACKLIST}, outfile, indent=4)

        return self.__add_message_to_JSON(response, "Successfully logged out")

    def detail_view(self, request):

        response = {}

        request_data = request.get_json()
        username = request_data.get("username")
        if username is None:
            raise InvalidUsernameError("Please provide a username")

        user = self.USER_TABLE.get_user(username)
        if user is None:
            raise NonexistantUserError(f"User '{username}' does not exist")

        response["user"] = user.make_json()

        return response

    def oauth(self, request):

        response = {}
        request_data = request.json

        username = request_data.get("username")
        email = request_data.get("email")
        display_name = request_data.get("display_name")
        privilege = "admin"
        password = b"netid"

        client_id = request_data.get("client_id")
        token = request_data.get("token")

        headers = {"x-api-key": client_id, "Authorization": f"Bearer {token}"}
        duke_response = requests.get(
            "https://api.colab.duke.edu/identity/v1/", headers=headers
        )

        data_matches = self.__match_oauth(request_data, duke_response.json())

        if not data_matches:
            raise UserException(f"Cannot confirm NetID user {username}")

        user = User(username, display_name, email, password, privilege)

        try:
            self.VALIDATOR.validate_shibboleth_login(user)
        except UserException as e:
            raise UserException(e.message)
        except Exception as e:
            print(str(e))
            raise UserException("Could not authorize shibboleth login")

        existing_user = self.USER_TABLE.get_user(user.username)
        if existing_user is None:
            self.USER_TABLE.add_user(user)
        else:
            privilege = existing_user.privilege

        # TODO: FIgure out what to do when adding netID user overwrites existing user

        response["token"] = self.AUTH_MANAGER.encode_auth_token(username)
        response["privilege"] = privilege
        response["message"] = "success"
        response["username"] = username

        # print("RESPONSE")
        # print(response)

        return response
