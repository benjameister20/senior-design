
# routes_datacenters
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
def list_all()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "datacenters": [
        {
            "abbreviation" : "DATACENTER ABBREVIATION",
            "datacenter_name": "DATACENTER_NAME"
        }
        {
            "abbreviation" : "DATACENTER ABBREVIATION",
            "datacenter_name": "DATACENTER_NAME"
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
    "abbreviation" : "DATACENTER ABBREVIATION",
    "datacenter_name": "DATACENTER_NAME",
    "is_offline_storage": BOOLEAN,
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
    "nameOriginal": "OLD NAME"
    "abbreviation" : "DATACENTER ABBREVIATION",
    "datacenter_name": "DATACENTER_NAME"
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
    "datacenter_name": "DATACENTER_NAME"
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
}
```
-----------------------------
