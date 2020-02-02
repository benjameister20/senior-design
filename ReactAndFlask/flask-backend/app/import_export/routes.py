import csv
import io
from http import HTTPStatus

from flask import Blueprint, request

import_export = Blueprint("import_export", __name__)


@import_export.route("/import", methods=["POST"])
def import_csv():
    """ Bulk import from a csv file """
    f = request.files["file"]
    if not f:
        return HTTPStatus.BAD_REQUEST

    stream: io.StringIO = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    csv_input = csv.reader(stream)

    for row in csv_input:
        print(row)

    stream.seek(0)
    stream.read()

    return HTTPStatus.OK
