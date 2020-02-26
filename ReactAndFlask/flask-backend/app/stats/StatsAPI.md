# routes_stats.py

-----------------------------
```language=python
def test():
```
- REST Type: 'get'
- Authentication Required: no
- Roled required: none
- Arguments:
```language=json
{
    "happy"

}
```
- Returns:
```language=json
{
    "user":{
            "username": "USERNAME",
            "display_name":"DISPLAY_NAME",
            "email":"EMAIL",
            "privilege":"PRIVILEGE",
            "password":"PASSWORD",
        }
}
```
-----------------------------
```language=python
def generate_report():
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: none
- Arguments:
```language=json
{
    "datacenter_name": "DATACENTER_NAME"

}
```
- Returns (example):
```language=json
{
{
      "modelUsage": "{\"dell 1234\": 7.14}",
      "ownerUsage": "{\"No owner listed\": 7.14}",
      "spaceUsage": "{\"A1\": 7.14}",
      "totalFree": 92.86,
      "totalUsage": 7.14,
      "vendorUsage": "{\"dell\": 7.14}"
}
}
```
-----------------------------
