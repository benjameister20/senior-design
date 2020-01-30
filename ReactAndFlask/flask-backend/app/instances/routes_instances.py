from app.instances.instance_manager import InstanceManager
from flask import Blueprint, request

instances = Blueprint(
    "instances", __name__, template_folder="templates", static_folder="static"
)

instancesArr = []
im = InstanceManager()


def convertToJson(arr):
    return {"instances": arr}


@instances.route("/instances/test", methods=["GET"])
def test():
    """ route to test instance endpoints """
    return "test"


@instances.route("/instances/create", methods=["POST"])
def create():
    """ Route for creating instances """
    global instancesArr

    instance = {
        "model": request.json["model"],
        "hostname": request.json["hostname"],
        "rack": request.json["rack"],
        "rackU": request.json["rackU"],
        "owner": request.json["owner"],
        "comment": request.json["comment"],
    }

    instancesArr.append(instance)
    instance_data = request.get_json()
    result = im.create_instance(instance_data)
    result = convertToJson(instancesArr)

    return result


@instances.route("/instances/delete", methods=["POST"])
def delete():
    """ Route for deleting instances """

    instance_data = request.get_json()
    result = im.delete_instance(instance_data)

    global instancesArr

    rack = (request.json["rack"],)
    rackU = (request.json["rackU"],)

    for n, i in enumerate(instancesArr):
        if instancesArr[i]["rack"] == rack and instancesArr[i]["rackU"] == rackU:
            del instancesArr[i]
            break

    result = convertToJson(instancesArr)

    return result


def filterInInstance(filter, instance):
    if filter in instance["model"]:
        return True
    if filter in instance["hostname"]:
        return True
    if filter in instance["rack"]:
        return True
    if filter in instance["rackU"]:
        return True
    if filter in instance["owner"]:
        return True
    if filter in instance["comment"]:
        return True

    return False


@instances.route("/instances/search/", methods=["POST"])
def search():
    """ Route for searching instances """
    global instancesArr

    filter = request.json["filter"]

    filteredInstances = []
    if filter == "":
        return convertToJson(instancesArr)

    for instance in instancesArr:
        try:
            if filterInInstance(filter, instance):
                filteredInstances.append(instance)
        except:
            continue
    print(filteredInstances)
    return convertToJson(filteredInstances)


@instances.route("/instances/edit", methods=["POST"])
def edit():
    """ Route for editing models """
    global instancesArr

    instance = {
        "model": request.json["model"],
        "hostname": request.json["hostname"],
        "rack": request.json["rack"],
        "rackU": request.json["rackU"],
        "owner": request.json["owner"],
        "comment": request.json["comment"],
    }

    for n, i in enumerate(instancesArr):
        if (
            instancesArr[i]["model"] == instance["model"]
            and instancesArr[i]["hostname"] == instance["hostname"]
        ):
            instancesArr[i] = instance
            break

    return convertToJson(instancesArr)


@instances.route("/instances/view", methods=["GET"])
def view():
    """ Route for table view of instances """

    result = im.view()

    return result


@instances.route("/instances/detailview", methods=["POST"])
def detail_view():
    """ Route for detail view of instance """

    instance_data = request.get_json()
    result = im.detail_view(instance_data)

    return result
