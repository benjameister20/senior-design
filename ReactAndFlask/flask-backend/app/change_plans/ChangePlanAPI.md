
# routes_changeplans
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
def create_cp()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: Asset Permission on at least 1 Datacenter
- Route: /changeplans/createplan
- Arguments:
```language=json
{
    "owner": "username of user making the change plan (current signed in)"
    "name": "name of change plan"
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
def delete_cp()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /changeplans/deleteplan
- Arguments:
```language=json
{
    "change_plan_id": unique id for change plan
    "owner": "username of user currently signed in"
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
def edit_cp()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /changeplans/editplan
- Arguments:
```language=json
{
    "change_plan_id": unique id for change plan
    "name": "new name of change plan"
    "owner": "username of user currently signed in"
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
def execute()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /changeplans/execute
- Arguments:
```language=json
{
    "change_plan_id": unique id for change plan
    "owner": "username of user currently signed in"
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
def get_cps()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /changeplans/getplans
- Arguments:
```language=json
{
    "owner": "username of user currently signed in"
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
    "change_plans": [
        {
            "change_plan_id": unique id for specific change plan
            "owner": "user who made the change plan"
            "name": "name of change plan"
            "executed": "True|False"
            "timestamp": "time of execution"|""
        },
        {
            "change_plan_id": unique id for specific change plan
            "owner": "user who made the change plan"
            "name": "name of change plan"
            "executed": "True|False"
            "timestamp": "time of execution"|""  
        }
    ]
}
```
-----------------------------

```language=python
def get_cp_actions()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /changeplans/getactions
- Arguments:
```language=json
{
    "change_plan_id": unique id for change plan
    "owner": "username of user currently signed in"
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
    "change_plan_actions": [
        {
            "step": int for sequence in change plan
            "action": str create/update/decommission/collateral indicating which action is to be done
            "asset_numberOriginal": if applicable asset number of asset being modified (for all except create)
            "old_record": {
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
            }
            "new_record": {
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
            }
        },
        {
            NEXT STEP
        }
   ]
}
```
-----------------------------
