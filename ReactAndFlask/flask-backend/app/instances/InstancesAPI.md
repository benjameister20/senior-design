
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
def search()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Arguments:
```language=json
{
    "filter":
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_position":"RACK_U"
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
    "datacenter_id": "DATACENTER",
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
    "datacenter_id": "DATACENTER",
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
            "datacenter_id": "DATACENTER",
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
