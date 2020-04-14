class Constants:

    API_SUCCESS = "success"
    COMMENT_KEY = "comment"
    RESULTS_KEY = "results"
    MESSAGE_KEY = "message"
    FILTER_KEY = "filter"
    LIMIT_KEY = "limit"
    LABEL_KEY = "label"
    NAME_KEY = "name"

    DATACENTER_KEY = "datacenter_id"
    NETWORK_NEIGHBORHOOD_KEY = "network_neighborhood"

    # User Keys
    ORIGINAL_USERNAME_KEY = "username_original"
    USERNAME_KEY = "username"
    PASSWORD_KEY = "password"
    EMAIL_KEY = "email"
    DISPLAY_NAME_KEY = "display_name"
    PRIVILEGE_KEY = "privilege"
    NETID_PASSWORD = "netid"
    TOKEN_KEY = "token"
    PERMISSION_KEY = "permission"
    PERMISSIONS_KEY = "permissions"
    PERMISSIONS_DC_KEY = "datacenters"

    # Model Keys
    VENDOR_KEY = "vendor"
    MODEL_NUMBER_KEY = "model_number"
    MODEL_ID_KEY = "model_id"
    HEIGHT_KEY = "height"
    DISPLAY_COLOR_KEY = "display_color"
    ETHERNET_PORT_KEY = "ethernet_ports"
    POWER_PORT_KEY = "power_ports"
    CPU_KEY = "cpu"
    MEMORY_KEY = "memory"
    STORAGE_KEY = "storage"

    # Model CSV Keys
    CSV_ETHERNET_PORT_KEY = "network_ports"
    CSV_NETWORK_PORT_1 = "network_port_name_1"
    CSV_NETWORK_PORT_2 = "network_port_name_2"
    CSV_NETWORK_PORT_3 = "network_port_name_3"
    CSV_NETWORK_PORT_4 = "network_port_name_4"

    VENDOR_ORIG_KEY = "vendorOriginal"
    MODEL_NUMBER_ORIG_KEY = "model_numberOriginal"
    HEIGHT_ORIG_KEY = "heightOriginal"

    # Asset Keys
    MODEL_KEY = "model"
    HOSTNAME_KEY = "hostname"
    RACK_KEY = "rack"
    RACK_POSITION_KEY = "rack_position"
    OWNER_KEY = "owner"
    MAC_ADDRESS_KEY = "mac_address"
    CONNECTION_HOSTNAME = "connection_hostname"
    CONNECTION_PORT = "connection_port"
    NETWORK_CONNECTIONS_KEY = "network_connections"
    POWER_CONNECTIONS_KEY = "power_connections"
    ASSET_NUMBER_KEY = "asset_number"

    ASSET_NUMBER_ORIG_KEY = "asset_numberOriginal"

    CSV_POWER_PORT_1 = "power_port_connection_1"
    CSV_POWER_PORT_2 = "power_port_connection_2"

    CHASSIS_KEY = "chassis"
    CHASSIS_PORT_KEY = "chassis_port_number"
    POWER_STATE_KEY = "power_state"

    # Rack Keys
    START_LETTER_KEY = "start_letter"
    START_NUMBER_KEY = "start_number"
    STOP_LETTER_KEY = "stop_letter"
    STOP_NUMBER_KEY = "stop_number"
    RACK_HEIGHT = 42

    # Datacenter Keys
    DC_ABRV_KEY = "abbreviation"
    DC_NAME_KEY = "datacenter_name"
    DC_ID_KEY = "datacenter_id"
    DC_IS_OFFLINE_KEY = "is_offline_storage"
    NAME_ORIG_KEY = "nameOriginal"

    CSV_DC_NAME_KEY = "datacenter"

    # Connection CSV KEYS
    CSV_SRC_HOST = "src_hostname"
    CSV_SRC_PORT = "src_port"
    CSV_SRC_MAC = "src_mac"
    CSV_DEST_HOST = "dest_hostname"
    CSV_DEST_PORT = "dest_port"

    # Decommission Constants
    DECOM_USER_KEY = "decommission_user"
    TIMESTAMP_KEY = "timestamp"
    START_DATE_KEY = "start_date"
    END_DATE_KEY = "end_date"

    # Change Plan
    EXECUTED_KEY = "executed"
    IDENTIFIER_KEY = "identifier"
    CHANGE_PLAN_ID_KEY = "change_plan_id"
    STEP_KEY = "step"
    ORIGINAL_STEP_KEY = "stepOriginal"
    OLD_RECORD_KEY = "old_record"
    NEW_RECORD_KEY = "new_record"
    DIFF_KEY = "diff"
    IS_CHANGE_PLAN_KEY = "is_change_plan"

    ACTION_KEY = "action"
    CREATE_KEY = "create"
    DECOMMISSION_KEY = "decommission"
    UPDATE_KEY = "update"
    COLLATERAL_KEY = "collateral"

    # BACKUPS
    ADMIN_EMAIL = "hyposoft1@gmail.com"
    # ADMIN_EMAIL = "cfg11@duke.edu"
    EMAIL_SUBJECT = "System Backup"
    EMAIL_MESSAGE = "A system backup has been initiated by your backup server."
    ##DEV
    # BACKUPS_DB = "d28l05824mjrs1"
    # BACKUPS_HOST = "ec2-184-72-235-159.compute-1.amazonaws.com"
    # BACKUPS_PORT = "5432"
    # BACKUPS_USER = "jypkfovvccdrut"
    # BACKUPS_PASS = "e98f55a65df17ec6ad5fb5662c9fd5d6df6b080256d03c44c16f508c30612da7"
    # PROD
    BACKUPS_DB = "d14poe0v72eiko"
    BACKUPS_HOST = "ec2-23-22-156-110.compute-1.amazonaws.com"
    BACKUPS_PORT = "5432"
    BACKUPS_USER = "jyocdbmfbuxnoq"
    BACKUPS_PASS = "6b0f7138c21cfee1ac0520a8e67cf0b0b635c651beed0306964e749d9565d351"
