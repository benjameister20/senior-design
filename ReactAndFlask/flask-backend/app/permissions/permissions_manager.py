from app.constants import Constants
from app.dal.datacenter_table import DatacenterTable, DBWriteException
from app.permissions.permissions_constants import PermissionConstants as pc


class PermissionsManager:
    def __init__(self):
        self.DCT = DatacenterTable()

    def get_permission_types(self):
        try:
            datacenters = self.DCT.get_all_datacenters()
        except DBWriteException as e:
            raise e
        except:
            raise DBWriteException("Could not get datacenters")

        datacenters_list = [dc.name for dc in datacenters]

        return {
            Constants.PERMISSIONS_KEY: [
                pc.MODEL,
                pc.ASSET,
                pc.POWER,
                pc.AUDIT,
                pc.ADMIN,
                pc.DATACENTERS,
            ],
            Constants.PERMISSIONS_DC_KEY: datacenters_list,
        }
