from app.backups.backups_manager import BackupsManager
from app.backups.email_manager import EmailManager
from app.constants import Constants
from app.exceptions.BackupExceptions import BackupError
from app.logging.logger import Logger
from flask import Blueprint, make_response, request, send_file

# from werkzeug import secure_filename

BM = BackupsManager()
EM = EmailManager()
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

    try:
        if not BM.authorize_backup(request.headers.get("passkey")):
            return add_message_to_JSON(response, "Unauthorized request for backup"), 403
    except BackupError as e:
        return add_message_to_JSON(response, e.message)
    except:
        return add_message_to_JSON(response, "Authorization failed")

    try:
        metadata = BM.generate_backup()
        EM.send_message(
            receiver=Constants.ADMIN_EMAIL,
            subject=Constants.EMAIL_SUBJECT,
            message=Constants.EMAIL_MESSAGE,
        )
    except BackupError as e:
        return add_message_to_JSON(response, e.message)
    except:
        return add_message_to_JSON(response, "Backup failed")

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


@backups.route("/backups/restore", methods=["POST"])
def restore():

    response = {}

    backup = None
    try:
        backup = request.files["file"]
    except KeyError:
        return add_message_to_JSON(
            response, "Please attach file to request with key 'file'"
        )

    try:
        BM.validate_filename(backup.filename)
    except BackupError as e:
        return add_message_to_JSON(response, e.message)
    except:
        return add_message_to_JSON(response, "File invalid")

    try:
        BM.save_backup_upload(backup)
        BM.restore_from_backup(backup.filename)
    except BackupError as e:
        return add_message_to_JSON(response, e.message)
    except:
        return add_message_to_JSON(response, "Failed to restore from backup archive")

    return add_message_to_JSON(response, "success")


def add_message_to_JSON(json, message) -> dict:
    json[Constants.MESSAGE_KEY] = message

    return json
