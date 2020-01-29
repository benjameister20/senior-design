from app.models.model_manager import ModelManager
from flask import Blueprint, request

models = Blueprint(
    "models", __name__, template_folder="templates", static_folder="static"
)

modelsArr = []
mm = ModelManager()


def convertToJson(arr):
    return {"models": arr}


@models.route("/models/test", methods=["GET"])
def test():
    """ route to test model endpoints """
    return "test"


@models.route("/models/create", methods=["POST"])
def create():
    """ Route for creating models """
    global modelsArr

    model = {
        "vendor": request.json["vendor"],
        "modelNumber": request.json["modelNumber"],
        "height": request.json["height"],
        "displayColor": request.json["displayColor"],
        "ethernetPorts": request.json["ethernetPorts"],
        "powerPorts": request.json["powerPorts"],
        "cpu": request.json["cpu"],
        "memory": request.json["memory"],
        "storage": request.json["storage"],
        "comments": request.json["comments"],
    }

    modelsArr.append(model)
    model_data = request.get_json()
    result = mm.create_model(model_data)
    result = convertToJson(modelsArr)

    return result


@models.route("/models/delete", methods=["POST"])
def delete():
    """ Route for deleting models """
    global modelsArr

    vendor = (request.json["vendor"],)
    model = (request.json["model"],)

    for tempModel in modelsArr:
        if tempModel["vendor"] == vendor and tempModel["model"] == model:
            del tempModel
            break

    # takes vendor and model number
    model_data = request.get_json()
    result = mm.delete_model(model_data)

    result = convertToJson(modelsArr)

    return result


def filterInModel(filter, model):
    if filter in model["vendor"]:
        return True
    if filter in model["modelNumber"]:
        return True
    if filter in model["height"]:
        return True
    if filter in model["displayColor"]:
        return True
    if filter in model["ethernetPorts"]:
        return True
    if filter in model["powerPorts"]:
        return True
    if filter in model["cpu"]:
        return True
    if filter in model["memory"]:
        return True
    if filter in model["storage"]:
        return True
    if filter in model["comments"]:
        return True

    return False


@models.route("/models/search/", methods=["POST"])
def search():
    """ Route for searching models """
    global modelsArr

    filter = request.json["filter"]

    filteredModels = []
    if filter == "":
        return convertToJson(modelsArr)

    for model in modelsArr:
        try:
            if filterInModel(filter, model):
                filteredModels.append(model)
        except:
            continue
    print(filteredModels)
    return convertToJson(filteredModels)


@models.route("/models/edit", methods=["POST"])
def edit():
    """ Route for editing models """
    global modelsArr

    model = {
        "vendor": request.json["vendor"],
        "modelNumber": request.json["modelNumber"],
        "height": request.json["height"],
        "displayColor": request.json["displayColor"],
        "ethernetPorts": request.json["ethernetPorts"],
        "powerPorts": request.json["powerPorts"],
        "cpu": request.json["cpu"],
        "memory": request.json["memory"],
        "storage": request.json["storage"],
        "comments": request.json["comments"],
    }

    for n, i in enumerate(modelsArr):
        if (
            modelsArr[i]["vendor"] == model["vendor"]
            and modelsArr[i]["modelNumber"] == model["modelNumber"]
        ):
            modelsArr[i] = model
            break

    return convertToJson(modelsArr)


@models.route("/models/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    result = mm.view()

    return result


@models.route("/models/detailview", methods=["POST"])
def detail_view():
    """ Route for table view of instances """

    model_data = request.get_json()
    result = mm.detail_view(model_data)

    return result
