import json
import os

import requests
from app.constants import Constants
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

blacklist_file = "/token_blacklist.json"
dirname = os.path.dirname(__file__)


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
        json[Constants.MESSAGE_KEY] = message

        return json

    @staticmethod
    def __make_user_from_json(json) -> User:
        return User(
            username=json.get(Constants.USERNAME_KEY),
            display_name=json.get(Constants.DISPLAY_NAME_KEY),
            email=json.get(Constants.EMAIL_KEY),
            password=json.get(Constants.PASSWORD_KEY),
            privilege=json.get(Constants.PRIVILEGE_KEY),
        )

    @staticmethod
    def __match_oauth(request, response):
        usernames_match = request.get(Constants.USERNAME_KEY) == response.get("netid")
        display_names_match = request.get(Constants.DISPLAY_NAME_KEY) == response.get(
            "displayName"
        )
        emails_match = request.get(Constants.EMAIL_KEY) == response.get("mail")

        return usernames_match and display_names_match and emails_match

    def search(self, request):
        request_data = request.get_json()
        print(request_data)
        filters = request_data.get(Constants.FILTER_KEY)
        limit = filters.get(Constants.LIMIT_KEY)
        if limit is None:
            limit = 1000

        users = self.USER_TABLE.search_users(
            username=filters.get(Constants.USERNAME_KEY),
            display_name=filters.get(Constants.DISPLAY_NAME_KEY),
            email=filters.get(Constants.EMAIL_KEY),
            privilege=filters.get(Constants.PRIVILEGE_KEY),
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
        print(request_data)
        try:
            username = request_data.get(Constants.USERNAME_KEY)
            password = request_data.get(Constants.PASSWORD_KEY)
            email = request_data.get(Constants.EMAIL_KEY)
            display_name = request_data.get(Constants.DISPLAY_NAME_KEY)
            privilege = request_data.get(Constants.PRIVILEGE_KEY)
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
        username = request_data.get(Constants.USERNAME_KEY)

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

        return self.__add_message_to_JSON(response, "Successfully deleted user")

    def edit(self, request):

        response = {}

        request_data = request.get_json()

        username_original = request_data.get(Constants.ORIGINAL_USERNAME_KEY)
        request_data.get(Constants.USERNAME_KEY)
        request_data.get(Constants.EMAIL_KEY)
        request_data.get(Constants.DISPLAY_NAME_KEY)
        request_data.get(Constants.PRIVILEGE_KEY)

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

        return self.__add_message_to_JSON(response, "Successfully edited user")

    def authenticate(self, request):
        # TESTED AND FUNCTIONAL
        """ Route for authenticating users """

        answer = {}

        request_data = request.get_json()
        username = request_data.get(Constants.USERNAME_KEY)
        attempted_password = request_data.get(Constants.PASSWORD_KEY)

        user = self.USER_TABLE.get_user(username)
        if user is None:
            raise NonexistantUserError(f"User '{username}' does not exist")

        if user.password.decode("utf-8") == Constants.NETID_PASSWORD:
            raise UserException(
                "Please click 'SIGN IN WITH NETID' to log in as a NetID user"
            )

        auth_success = self.AUTH_MANAGER.compare_pw(attempted_password, user.password)
        if not auth_success:
            raise IncorrectPasswordError("Incorrect password")

        answer[Constants.TOKEN_KEY] = self.AUTH_MANAGER.encode_auth_token(username)
        answer[Constants.PRIVILEGE_KEY] = user.privilege

        return self.__add_message_to_JSON(answer, Constants.API_SUCCESS)

    def logout(self, request):
        global dirname
        global blacklist_file

        response = {}

        token = request.headers.get(Constants.TOKEN_KEY)
        self.BLACKLIST.append(token)
        # print(self.BLACKLIST)

        with open(dirname + blacklist_file, "w") as outfile:
            json.dump({"blacklist": self.BLACKLIST}, outfile, indent=4)

        return self.__add_message_to_JSON(response, Constants.API_SUCCESS)

    def detail_view(self, request):

        response = {}

        request_data = request.get_json()
        username = request_data.get(Constants.USERNAME_KEY)
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

        username = request_data.get(Constants.USERNAME_KEY)
        email = request_data.get(Constants.EMAIL_KEY)
        display_name = request_data.get(Constants.DISPLAY_NAME_KEY)
        privilege = "user"
        password = Constants.NETID_PASSWORD.encode("utf-8")

        client_id = request_data.get("client_id")
        token = request_data.get(Constants.TOKEN_KEY)

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

        response[Constants.TOKEN_KEY] = self.AUTH_MANAGER.encode_auth_token(username)
        response[Constants.PRIVILEGE_KEY] = privilege
        response[Constants.MESSAGE_KEY] = Constants.API_SUCCESS
        response[Constants.USERNAME_KEY] = username

        # print("RESPONSE")
        # print(response)

        return response
