
# routes_instances
-----------------------------
```language=python
def test()
```
- REST Type: 'get'
- Authentication Required: no
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "test"
}
```
-----------------------------
```language=python
def get_next_asset_number()
```
- Path: '/instances/nextAssetNumber/'
- REST Type: 'get'
- Authentication Required: yes
- Roled required: admin
- Arguments: none
- Returns:
```language=json
{
    "asset_number":ASSET_NUMBER_AS_INTEGER
}
```
-----------------------------
```language=python
def search()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Arguments:
```language=json
{
    "datacenter_name": "DATACENTER_NAME"
    "filter":
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "starting_rack_letter":"STARTING_LETTER",
            "ending_rack_letter":"ENDING_LETTER",
            "starting_rack_number":STARTING_NUMBER,
            "ending_rack_number":ENDING_NUMBER,
        }
    "limit":OPTIONAL_LIMIT
}
```
- Returns:
```language=json
{
    "instances": [
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"  
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS	    
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS	
        }
    ]
}
```
-----------------------------
```language=python
def create()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "model":"MODEL",
    "hostname":"HOSTNAME",
    "rack":"RACK",
    "rack_position":"RACK_U",
    "owner":"OWNER",
    "comment":"COMMENT"
    "datacenter_name": "DATACENTER",
    "network_connections": {
        PORT_NAME_1: {
            "mac_address":MAC_ADDRESS,
            "connection_hostname":HOSTNAME,
            "connection_port":CONNECTION_PORT_NAME,
        },
        PORT_NAME_2: {
            "mac_address":MAC_ADDRESS,
            "connection_hostname":HOSTNAME,
            "connection_port":CONNECTION_PORT_NAME,
        },
        PORT_NAME_3: {
            "mac_address":MAC_ADDRESS,
            "connection_hostname":HOSTNAME,
            "connection_port":CONNECTION_PORT_NAME,
        }
    }
    "power_connections": [ L3, R5, ... ]
    "asset_number": "ASSET NUMBER",  
    "display_color": "DISPLAY_COLOR",
    "cpu": "CPU",
    "memory": MEMORY,
    "storage": "STORAGE",
    "chassis_hostname": "CHASSIS HOSTNAME",
    "chassis_slot": BLADE POSITION IN CHASSIS    
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
}
```
-----------------------------
```language=python
def delete()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "asset_number": "ASSET NUMBER",
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
}
```
-----------------------------
```language=python
def edit()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "asset_numberOriginal": "ORIGINAL ASSET NUMBER"
    "model":"MODEL",
    "hostname":"HOSTNAME",
    "rack":"RACK",
    "rack_position":"RACK_U",
    "owner":"OWNER",
    "comment":"COMMENT"
    "datacenter_name": "DATACENTER",
    "tags": "TAGS",
    "mac_address": "MAC ADDRESSES,
    "network_connections": "NETWORK CONNECTIONS",
    "power_connections": "POWER CONNECTIONS",
    "asset_number": "ASSET NUMBER",  
    "display_color": "DISPLAY_COLOR",
    "cpu": "CPU",
    "memory": MEMORY,
    "storage": "STORAGE",
    "chassis_hostname": "CHASSIS HOSTNAME",
    "chassis_slot": BLADE POSITION IN CHASSIS        
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
}
```
-----------------------------
```language=python
def detail_view()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Arguments:
```language=json
{
    "asset_number": "ASSET NUMBER",
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
    "instances":[
        {
            "model": "MODEL",
            "hostname": "HOSTNAME",
            "rack": "RACK",
            "rack_position": "RACK_U",
            "owner": "OWNER",
            "comment": "COMMENT"
            "datacenter_name": "DATACENTER NAME",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS    	    
        },
    ]
}
```
-----------------------------
```language=python
def assisted_model_input()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "message":null||"ERROR_MESSAGE",
    "results":[
        "MODEL_A",
        "MODEL_B",
        "MODEL_C",
        "MODEL_D",
    ]
}
```
-----------------------------
```language=python
def get_barcode_labels()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/labelgen
- Arguments:
```language=json
{
    "asset_number": [ASSET NUMBER LIST],
}
```
- Returns:
    PDF file of barcodes
-----------------------------
```language=python
def get_all_chassis()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/getchassis
- Arguments: None
- Returns:
```language=json
{
    "instances": [
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS    
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"  
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS    
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
            "datacenter_id": "DATACENTER",
            "tags": "TAGS",
            "mac_address": "MAC ADDRESSES,
            "network_connections": "NETWORK CONNECTIONS",
            "power_connections": "POWER CONNECTIONS",
            "asset_number": "ASSET NUMBER",  
            "display_color": "DISPLAY_COLOR",
            "display_colorOriginal": "DISPLAY COLOR OF MODEL",
            "cpu": "CPU",
            "cpuOriginal": "CPU OF MODEL",
            "memory": MEMORY,
            "memoryOriginal": MEMORY OF MODEL,
            "storage": "STORAGE",  
            "storageOriginal": "STORAGE OF MODEL"
            "mount_type": "MOUNT TYPE (blade/chassis/rackmount)",
	    "chassis_hostname": "CHASSIS HOSTNAME",
	    "chassis_slot": BLADE POSITION IN CHASSIS    
        }
    ]
}
```
-----------------------------
```language=python
def set_chassis_port_state()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/setChassisPortState
- Arguments:
```language=json
{
	"chassis": CHASSIS HOSTNAME,
	"chassis_port_number": INT between 1-14,
	"power_state": "on" or "off"
}
```
- Returns:
```language=json
{
    "message": "Success"
}
```
-----------------------------
```language=python
def get_chassis_port_state()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/getChassisPortState
- Arguments:
```language=json
{
    "chassis": CHASSIS HOSTNAME,
    "chassis_port_number": INT between 1-14,
}
```
- Returns:
```language=json
{
  "message": "Success",
  "metadata": "none",
  "power_state": "ON" or "OFF"
}
```
-----------------------------
```language=python
def get_all_chassis_port_states()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/getAllChassisPortStates
- Arguments:
```language=json
{
    "chassis": CHASSIS HOSTNAME,
}
```
- Returns:
```language=json
{
  "message": "Success",
  "metadata": "none",
  "power_state": {
    "1": "ON" or "OFF",
    "10": "ON" or "OFF",
    "11": "ON" or "OFF",
    "12": "ON" or "OFF",
    "13": "ON" or "OFF",
    "14": "ON" or "OFF",
    "2": "ON" or "OFF",
    "3": "ON" or "OFF",
    "4": "ON" or "OFF",
    "5": "ON" or "OFF",
    "6": "ON" or "OFF",
    "7": "ON" or "OFF",
    "8": "ON" or "OFF",
    "9": "ON" or "OFF"
  }
}
```
-----------------------------
```language=python
def get_pdu_power_states()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/getPDUPowerStates
- Arguments:
```language=json
{
    "rack_letter": CAPITAL LETTER FOR RACK A-E,
    "rack_number": INT 1-19,
    "rack_side": "L" or "R"
}
```
- Returns:
```language=json
{
  "message": "Success",
  "states": {
        "1": "ON" or "OFF",
        "2": "ON" or "OFF",
        "3": "ON" or "OFF",
        "4": "ON" or "OFF",
        "5": "ON" or "OFF",
        "6": "ON" or "OFF",
        "7": "ON" or "OFF",
        "8": "ON" or "OFF",
        "9": "ON" or "OFF",
        "10": "ON" or "OFF",
        "11": "ON" or "OFF",
        "12": "ON" or "OFF",
        "13": "ON" or "OFF",
        "14": "ON" or "OFF",
        "15": "ON" or "OFF",
        "16": "ON" or "OFF",
        "17": "ON" or "OFF",
        "18": "ON" or "OFF",
        "19": "ON" or "OFF",
        "20": "ON" or "OFF",
        "21": "ON" or "OFF",
        "22": "ON" or "OFF",
        "23": "ON" or "OFF",
        "24": "ON" or "OFF",
  }
}
```
-----------------------------
```language=python
def set_pdu_power_state()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Endpoint: /instances/setPDUPowerState
- Arguments:
```language=json
{
    "rack_letter": CAPITAL LETTER FOR RACK A-E,
    "rack_number": INT 1-19,
    "rack_side": "L" or "R",
    "rack_port": INT 1-24 ,
    "rack_port_state": "on" or "off"
}
```
- Returns:
```language=json
{
  "message": "Success"
}
```
