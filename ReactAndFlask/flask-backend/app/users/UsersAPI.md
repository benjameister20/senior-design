
# routes_users.py
-----------------------------
```language=python
def test()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: 'user'
- Arguments: none
- Returns:
```language=json
{
    "hello"
}
```
-----------------------------
```language=python
def search():
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "filter":
        {
            "username":
            "display_name":
            "email":
            "privilege":
        }
    "limit":OPTIONAL_LIMIT
}
```
- Returns:
```language=json
{
    "users": [
        {
            "username":"USERNAME",
            "password":"PASSWORD",
            "email":"EMAIL",
            "display_name":"DISPLAY_NAME",
            "privilege": {
                "Model": bool,
                "Asset": bool,
                "Datacenters": List[str],
                "Power": bool,
                "Audit": bool,
                "Admin": bool
            }
        },
        {
            "username":"USERNAME",
            "password":"PASSWORD",
            "email":"EMAIL",
            "display_name":"DISPLAY_NAME",
            "privilege": {
                "Model": bool,
                "Asset": bool,
                "Datacenters": List[str],
                "Power": bool,
                "Audit": bool,
                "Admin": bool
            }
        },
        {
            "username":"USERNAME",
            "password":"PASSWORD",
            "email":"EMAIL",
            "display_name":"DISPLAY_NAME",
            "privilege": {
                "Model": bool,
                "Asset": bool,
                "Datacenters": List[str],
                "Power": bool,
                "Audit": bool,
                "Admin": bool
            }
        }
    ]
}
```
-----------------------------
```language=python
def create():
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "username":"USERNAME",
    "password":"PASSWORD",
    "email":"EMAIL",
    "display_name":"DISPLAY_NAME",
    "privilege": "PRIVILEGE"
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
def delete():
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "username":"USERNAME"
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
def edit():
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: 'admin'
- Arguments:
```language=json
{
    "username_original":"USERNAME",
    "username": "USERNAME",
    "display_name":"DISPLAY_NAME",
    "email":"EMAIL",
    "privilege":"PRIVILEGE",
    "password":"PASSWORD",

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
def authenticate():
```
- REST Type: 'post'
- Authentication Required: no
- Roled required: none
- Arguments:
```language=json
{
    "username": "USERNAME",
    "password":"PASSWORD",

}
```
- Returns:
```language=json
{
    "message":"success"||"ERROR_MESSAGE",
    "token":"TOKEN",
    "privilege":"PRIVILEGE"
}
```
-----------------------------
```language=python
def logout():
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "message":"Successfully logged out"
}
```
-----------------------------
```language=python
def detail_view()
```
- REST Type: 'post'
- Authentication Required: yes
- Roled required: admin
- Arguments:
```language=json
{
    "username": "USERNAME"

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
