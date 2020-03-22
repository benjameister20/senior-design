import datetime

from app.constants import Constants
from app.dal.decommission_table import DecommissionTable
from app.dal.instance_table import InstanceTable
from app.data_models.decommission import Decommission
from app.data_models.instance import Instance
from app.exceptions.InvalidInputsException import InvalidInputsError
from app.instances.instance_manager import InstanceManager


class DecommissionManager:
    def __init__(self):
        self.decommission_table = DecommissionTable()
        self.instance_table = InstanceTable()
        self.instance_manager = InstanceManager()

    def decommission_asset(self, asset_data):
        try:
            asset_number = self.check_null(asset_data[Constants.ASSET_NUMBER_KEY])
            decommission_user = self.check_null(asset_data[Constants.USERNAME_KEY])

            timestamp = datetime.date.today()

            try:
                asset = self.instance_table.get_instance_by_asset_number(asset_number)
                network_neighborhood = self.instance_manager.get_network_neighborhood(
                    asset_number
                )
            except:
                raise InvalidInputsError(
                    "An error occurred when retrieving asset data."
                )

            decommission = self.make_decommission(
                asset=asset,
                timestamp=timestamp,
                decommission_user=decommission_user,
                network_neighborhood=network_neighborhood,
            )

            try:
                self.decommission_table.add_decommission(decommission)
                self.instance_table.delete_instance_by_asset_number(asset_number)
            except:
                raise InvalidInputsError(
                    "An error occurred when attempting to decommission the asset."
                )

            # Remove network/power connections

        except InvalidInputsError as e:
            print(e.message)
            raise InvalidInputsError(e.message)
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when attempting to decommission the asset."
            )

    def get_decommissions(self, filter):
        decommission_user = filter.get(Constants.DECOM_USER_KEY)
        start_date = filter.get(Constants.START_DATE_KEY)
        end_date = filter.get(Constants.END_DATE_KEY)

        try:
            decommission_list = self.decommission_table.get_decommissions_with_filters(
                user=decommission_user, start_date=start_date, end_date=end_date,
            )
            return decommission_list
        except Exception as e:
            print(str(e))
            raise InvalidInputsError(
                "An error occurred when retrieving decommissioned assets."
            )

    def make_decommission(
        self, asset: Instance, timestamp, decommission_user, network_neighborhood
    ):
        model = self.instance_manager.get_model_from_id(asset.model_id)
        datacenter = self.instance_manager.get_dc_from_id(asset.datacenter_id)

        return Decommission(
            vendor=model.vendor,
            model_number=model.model_number,
            height=model.height,
            hostname=asset.hostname,
            rack_label=asset.rack_label,
            rack_position=asset.rack_position,
            owner=asset.owner,
            comment=asset.comment,
            datacenter_name=datacenter.name,
            network_connections=asset.network_connections,
            power_connections=asset.power_connections,
            asset_number=asset.asset_number,
            timestamp=timestamp,
            decommission_user=decommission_user,
            network_neighborhood=network_neighborhood,
        )

    def check_null(self, val):
        if val is None:
            return ""
        else:
            return val
