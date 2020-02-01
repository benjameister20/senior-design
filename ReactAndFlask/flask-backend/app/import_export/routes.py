from http import HTTPStatus

from flask import Blueprint

import_export = Blueprint("import_export", __name__)


@import_export.route("/import", methods=["POST"])
def import_csv():
    """ Bulk import from a csv file """
    return HTTPStatus.OK
