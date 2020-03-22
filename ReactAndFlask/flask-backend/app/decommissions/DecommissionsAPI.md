
# routes_decommissions
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
def decommission_asset()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: asset permission/admin
- Route: /decommissions/decommission_asset/
- Arguments: 
```language=json
{
    "asset_number": ASSET_NUMBER,
    "decommission_user": "USER SIGNED IN/USER DECOMMISSIONING THE ASSET"
}
```
- Returns:
```language=json
{
    "message": "success|failure"
}
```
-----------------------------

```language=python
def search()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Route: /decommissions/search
- Arguments:
```language=json
{
	"filter": {
		"decommission_user": "USER WHO DECOMMISSIONED ASSET",
		"start_date": "BEGINNING DATE RANGE (YYYY-MM-DD)",
		"end_date": "END DATE RANGE (YYYY-MM-DD)"
	}
}
```
- Returns:
```language=json
{
  "decommissions": [
    {
      "asset_number": ASSET_NUMBER,
      "comment": "COMMENT",
      "datacenter_name": "DATACENTER NAME",
      "decommission_user": "USER WHO DECOMMISSIONED ASSET",
      "height": ASSET HEIGHT,
      "hostname": "HOSTNAME",
      "model_number": "MODEL NUMBER OF ASSET",
      "network_connections": {
        "PORT 1": {
          "connection_hostname": "HOSTNAME OF ASSET IT WAS CONNECTED TO",
          "connection_port": "PORT ON OTHER ASSET IT IS CONNECTED TO",
          "mac_address": "MAC ADDRESS OF PORT"
        },
        "PORT 2": {
          "connection_hostname": "",
          "connection_port": "",
          "mac_address": ""
        }
      },
      "network_neighborhood": {
        "HOSTNAME OF CONNECTION 1": [
          "HOSTNAME OF LAYER 2 CONNECTIONS",
        ]
        "HOSTNAME OF CONNECTION 2": [
          "HOSTNAME OF LAYER 2 CONNECTIONS",
        ]
      },
      "owner": "OWNER",
      "power_connections": [POWER CONNECTIONS ("L1", "R1", etc.],
      "rack": "RACK LABEL",
      "rack_position": RACK U,
      "timestamp": "DATE OF DECOMMISSION (i.e. Sat, 21 Mar 2020 00:00:00 GMT)",
      "vendor": "VENDOR"
    },
    {
      "asset_number": 100002,
      "comment": "",
      "datacenter_name": "Research Triangle Park 1",
      "decommission_user": "admin",
      "height": 4,
      "hostname": "teer2",
      "model_number": "Foobar",
      "network_connections": {
        "1": {
          "connection_hostname": "teer3",
          "connection_port": "1",
          "mac_address": ""
        },
        "en": {
          "connection_hostname": "",
          "connection_port": "",
          "mac_address": ""
        }
      },
      "network_neighborhood": {},
      "owner": "admin",
      "power_connections": [
        "L1",
        "R1"
      ],
      "rack": "B1",
      "rack_position": 1,
      "timestamp": "Sat, 21 Mar 2020 00:00:00 GMT",
      "vendor": "Lenovo"
    }
  ],
  "message": "success",
  "metadata": "none"
}

```
-----------------------------
