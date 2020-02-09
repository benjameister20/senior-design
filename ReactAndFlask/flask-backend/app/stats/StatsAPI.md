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
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
    TODO: FINISH THIS
}
```
-----------------------------
