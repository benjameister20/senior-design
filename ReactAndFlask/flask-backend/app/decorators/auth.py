from functools import wraps
from typing import List

import jwt
from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable
from app.dal.instance_table import InstanceTable
from app.dal.user_table import UserTable
from app.permissions.permissions_constants import PermissionConstants
from app.users.authentication import AuthManager

AUTH_MANAGER = AuthManager()
USER_TABLE = UserTable()

# class PermissionException(Exception):
#     def __init__(self, message):
#         self.message = message

# class InsufficientPermissionError(PermissionException):
#     def __init__(self, message):
#         super().__init__(message)
class PermissionActions:
    CHANGEPLAN_CREATE = "changeplan_create"  # DATACENTER NAME
    CHANGEPLAN_EDIT = (
        "changeplan_edit"  # ORIG ASSET NUM AND DATACENTER NAME (FOR UPDATED VAL)
    )
    CHANGEPLAN_DECOMMISSION = "changeplan_decommission"  # ASSET NUM
    ASSET_CREATE = "asset_create"  # DATACENTER NAME
    ASSET_DELETE = "asset_delete"  # ASSET NUMBER
    ASSET_EDIT = "asset_edit"  # ORIG ASSET NUM AND DATACENTER NAME (FOR UPDATED VAL)
    ASSET_DECOMMISSION = "asset_decommission"  # ASSET NUM
    NO_DATACENTER = "no_datacenter"


class DatacenterPermissionChecker:
    def __init__(self):
        pass

    def __get_dc_name_from_asset_num(self, asset_number):
        instance = InstanceTable().get_instance_by_asset_number(asset_number)
        datacenter_id = instance.datacenter_id
        datacenter_name = DatacenterTable().get_datacenter(datacenter_id)

        return datacenter_name

    def __get_required_datacenters_from_request(self, request, action):
        required_datacenters: List[str] = []

        # use action to parse required datacenters from request
        if action == PermissionActions.CHANGEPLAN_CREATE:
            required_datacenters.append(
                request.get(Constants.NEW_RECORD_KEY).get(Constants.DC_NAME_KEY)
            )

        if action == PermissionActions.CHANGEPLAN_EDIT:
            required_datacenters.extend(
                [
                    request.get(Constants.NEW_RECORD_KEY).get(Constants.DC_NAME_KEY),
                    self.__get_dc_name_from_asset_num(
                        request.get(Constants.ASSET_NUMBER_ORIG_KEY)
                    ),
                ]
            )

        if action == PermissionActions.CHANGEPLAN_DECOMMISSION:
            required_datacenters.append(
                self.__get_dc_name_from_asset_num(
                    request.get(Constants.ASSET_NUMBER_ORIG_KEY)
                )
            )

        if action == PermissionActions.ASSET_CREATE:
            required_datacenters.append(request.get(Constants.DC_NAME_KEY))

        if action == PermissionActions.ASSET_EDIT:
            required_datacenters.extend(
                [
                    request.get(Constants.DC_NAME_KEY),
                    self.__get_dc_name_from_asset_num(
                        request.get(Constants.ASSET_NUMBER_ORIG_KEY)
                    ),
                ]
            )

        if action == PermissionActions.ASSET_DELETE:
            required_datacenters.append(
                self.__get_dc_name_from_asset_num(
                    request.get(Constants.ASSET_NUMBER_ORIG_KEY)
                )
            )

        if action == PermissionActions.ASSET_DECOMMISSION:
            required_datacenters.append(
                self.__get_dc_name_from_asset_num(
                    request.get(Constants.ASSET_NUMBER_ORIG_KEY)
                )
            )

        return required_datacenters

    def check_permission(self, request, user, action):
        required_datacenters = self.__get_required_datacenters_from_request(
            request, action
        )
        allowed_datacenters = user.datacenters

        for datacenter in required_datacenters:
            if datacenter not in allowed_datacenters:
                return False

        return True


def requires_auth(request):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # print(request.headers)
                # print(request.headers["token"])
                # print(Constants.TOKEN_KEY)
                # print(request.headers.get(Constants.TOKEN_KEY))
                request.headers[Constants.TOKEN_KEY]
            except KeyError:
                # print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}

            is_validated = False
            message = ""
            try:
                is_validated, message = AUTH_MANAGER.validate_auth_token(
                    request.headers
                )
            except jwt.ExpiredSignatureError:
                return {Constants.MESSAGE_KEY: "Token expired, please login again."}
            except jwt.InvalidTokenError:
                return {
                    Constants.MESSAGE_KEY: "Token invalid, please provide a valid token."
                }
            except Exception:
                return {Constants.MESSAGE_KEY: "Could not verify authentication."}

            if not is_validated:
                return {Constants.MESSAGE_KEY: message}

            return f(*args, **kwargs)

        return wrapper

    return wrap


def requires_permission(request, permission, action):
    def wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                # request.headers[Constants.PRIVILEGE_KEY]
                token = request.headers[Constants.TOKEN_KEY]
            except KeyError as e:
                print(str(e))
                return {Constants.MESSAGE_KEY: "Please provide auth token"}
            username = AUTH_MANAGER.decode_auth_token(token)
            user = USER_TABLE.get_user(username)
            if user is None:
                return {Constants.MESSAGE_KEY: f"User {username} does not exist"}

            user_permissions = user.privilege
            user.datacenters
            try:
                request.json.get(Constants.DC_NAME_KEY)
            except:
                pass
            # Check input permissions against permissions that the user has
            # print("\nUSER PERMISSIONS")
            # print(user_permissions)
            if not user_permissions[PermissionConstants.ADMIN]:
                # check bool permissions are satisfied
                permission_json = permission.make_json()
                for key in permission_json:
                    if (
                        permission_json[key] is True
                        and user_permissions[key] is not True
                    ):
                        return {
                            Constants.MESSAGE_KEY: f"User {username} does not have {key} permission"
                        }

                # check datacenter permission satistifed
                if action != PermissionActions.NO_DATACENTER:
                    has_permission = DatacenterPermissionChecker().check_permission(
                        request, user, action
                    )
                    if not has_permission:
                        return {
                            Constants.MESSAGE_KEY: f"User {username} does not have access to the required datacenter(s)"
                        }

            return f(*args, **kwargs)

        return wrapper

    return wrap
