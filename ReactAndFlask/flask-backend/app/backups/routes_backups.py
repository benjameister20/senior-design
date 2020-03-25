from app.backups.backups_manager import BackupsManager
from app.constants import Constants
from app.exceptions.BackupExceptions import BackupError
from app.logging.logger import Logger
from flask import Blueprint, Response, make_response, request, send_file

BM = BackupsManager()
LOGGER = Logger()

backups = Blueprint(
    "backups", __name__, template_folder="templates", static_folder="static"
)


@backups.route("/backups/test", methods=["GET"])
# @requires_auth(request)
def test():
    """ route to test user endpoints """

    response = {}

    return add_message_to_JSON(response, "hello")


@backups.route("/backups/getBackup", methods=["GET"])
def backup():

    response = {}
    metadata = None

    if not BM.authorize_backup(request.headers["passkey"]):
        print("Unauthorized request")
        return Response(
            add_message_to_JSON(response, "Unauthorized request for backup"), status=403
        )

    try:
        metadata = BM.generate_backup()
    except BackupError as e:
        return add_message_to_JSON(response, e.message)

    response = make_response(
        send_file(
            filename_or_fp=metadata["file_path"],
            mimetype="application/tar",
            as_attachment=True,
            last_modified=metadata["datetime"],
        )
    )

    response.headers["filename"] = metadata["filename"]
    response.headers["datetime"] = metadata["datetime"]

    return response


def add_message_to_JSON(json, message) -> dict:
    json[Constants.MESSAGE_KEY] = message

    return json
