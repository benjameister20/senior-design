
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
def create()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "abbreviation" : "DATACENTER ABBREVIATION",
    "name": "FULL NAME"
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
    "name": "FULL NAME"
}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
}
```
-----------------------------
