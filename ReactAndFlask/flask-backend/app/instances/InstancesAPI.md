
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
    "tags": "TAGS",
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
    "power_connections": "POWER CONNECTIONS",
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
