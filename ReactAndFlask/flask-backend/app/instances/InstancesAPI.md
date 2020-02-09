
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
            "rack_u":"RACK_U"
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
            "rack_u":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_u":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
        },
        {
            "model":"MODEL",
            "hostname":"HOSTNAME",
            "rack":"RACK",
            "rack_u":"RACK_U",
            "owner":"OWNER",
            "comment":"COMMENT"
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
    "rack_u":"RACK_U",
    "owner":"OWNER",
    "comment":"COMMENT"
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
    "rack":"RACK",
    "rack_u":"RACK_U"
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
    "rackOriginal":"RACK_ORIGINAL",
    "rack_uOriginal":"RACK_U_ORIGINAL",
    "model":"MODEL",
    "hostname":"HOSTNAME",
    "rack":"RACK",
    "rack_u":"RACK_U",
    "owner":"OWNER",
    "comment":"COMMENT"
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
    "rack": "RACK",
    "rack_u":"RACK_U"

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
            "rack_u": "RACK_U",
            "owner": "OWNER",
            "comment": "COMMENT"
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
