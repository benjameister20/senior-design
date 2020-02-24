
# routes_models
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
    "vendor": "VENDOR",
    "model_number": "MODEL_NUMBER",
    "height": "HEIGHT" || HEIGHT,
    "display_color": "DISPLAY_COLOR",
    "ethernet_ports": [ETHERNET_PORTS],
    "power_ports": "POWER_PORTS",
    "cpu": "CPU",
    "memory": "MEMORY",
    "storage": "STORAGE",
    "comment": "COMMENT"
}
```
- Returns:
```language=json
{
    "message": "success" || "ERROR_MESSAGE",
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
            "vendor": "VENDOR",
            "model_number": "MODEL_NUMBER",
            "height": "HEIGHT" || HEIGHT,
            "display_color": "DISPLAY_COLOR",
            "ethernet_ports": [ETHERNET_PORTS],
            "power_ports": "POWER_PORTS",
            "cpu": "CPU",
            "memory": "MEMORY",
            "storage": "STORAGE"
        }
    "limit": "OPTIONAL_LIMIT" || OPTIONAL_LIMIT
}
```
- Returns:
```language=json
{
    "message":"success",
    "models": [
        {
            "vendor": "VENDOR",
            "model_number": "MODEL_NUMBER",
            "height": "HEIGHT",
            "display_color": "DISPLAY_COLOR",
            "ethernet_ports": [ETHERNET_PORTS],
            "power_ports": "POWER_PORTS",
            "cpu": "CPU",
            "memory": "MEMORY",
            "storage": "STORAGE",
            "comment": "COMMENT",
        },
        {
            "vendor": "VENDOR",
            "model_number": "MODEL_NUMBER",
            "height": "HEIGHT",
            "display_color": "DISPLAY_COLOR",
            "ethernet_ports": [ETHERNET_PORTS],
            "power_ports": "POWER_PORTS",
            "cpu": "CPU",
            "memory": "MEMORY",
            "storage": "STORAGE",
            "comment": "COMMENT",
        },
        {
            "vendor": "VENDOR",
            "model_number": "MODEL_NUMBER",
            "height": "HEIGHT",
            "display_color": "DISPLAY_COLOR",
            "ethernet_ports": [ETHERNET_PORTS],
            "power_ports": "POWER_PORTS",
            "cpu": "CPU",
            "memory": "MEMORY",
            "storage": "STORAGE",
            "comment": "COMMENT",
        }
    ]
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
    "vendor": "VENDOR",
    "model_number": "MODEL_NUMBER"
}
```
- Returns:
```language=json
{
    "message": "success" || "ERROR_MESSAGE",
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
    "vendorOriginal": "VENDOR_ORIGINAL",
    "model_numberOriginal": "MODEL_NUMBER_ORIGINAL",
    "heightOriginal": "HEIGHT_ORIGINAL",
    "vendor": "VENDOR",
    "model_number": "MODEL_NUMBER",
    "height": "HEIGHT" || HEIGHT,
    "display_color": "DISPLAY_COLOR",
    "ethernet_ports": [ETHERNET_PORTS],
    "power_ports": "POWER_PORTS",
    "cpu": "CPU",
    "memory": "MEMORY",
    "storage": "STORAGE",
    "comment": "COMMENT"
}
```
- Returns:
```language=json
{
    "message": "success" || "ERROR_MESSAGE",
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
    "vendor": "VENDOR",
    "model_number": "MODEL_NUMBER"
}
```
- Returns:
```language=json
{
    "message": "success" || "ERROR_MESSAGE",
    "models":[
        {
            "vendor": "VENDOR",
            "model_number": "MODEL_NUMBER",
            "height": "HEIGHT",
            "display_color": "DISPLAY_COLOR",
            "ethernet_ports": [ETHERNET_PORTS],
            "power_ports": "POWER_PORTS",
            "cpu": "CPU",
            "memory": "MEMORY",
            "storage": "STORAGE",
            "comment": "COMMENT",
        }
    ]
}
```
-----------------------------
```language=python
def assisted_vendor_input()
```
- REST Type: 'get'
- Authentication Required: yes
- Roled required: none
- Arguments: none
- Returns:
```language=json
{
    "message": null || "ERROR_MESSAGE",
    "results":[
        "VENDOR_A",
        "VENDOR_B",
        "VENDOR_C",
        "VENDOR_D",
    ]
}
```
-----------------------------
