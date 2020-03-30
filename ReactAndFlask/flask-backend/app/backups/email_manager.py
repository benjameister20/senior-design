""" Code for GMAIL integration taken from Google API sample docs
    https://developers.google.com/gmail/api/quickstart/python
    https://developers.google.com/gmail/api/v1/reference/users/messages/send

"""
from __future__ import print_function

import os
import smtplib
from email.mime.text import MIMEText

CONTEXT = os.path.dirname(__file__)


class EmailManager:
    def __init__(self):
        self.email_acct = "hyposoftbackupsystems@gmail.com"
        self.pswd = "P8ssw0rd1!@"

    def send_message(self, receiver, subject, message):
        msg = MIMEText(message)

        msg["Subject"] = subject
        msg["From"] = self.email_acct
        msg["To"] = receiver

        # Log into email account
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.ehlo()
        server.login(self.email_acct, self.pswd)

        # sending the mail
        server.sendmail(self.email_acct, receiver, msg.as_string())

        # terminating the session
        server.close()


if __name__ == "__main__":

    EM = EmailManager()
    EM.send_message("cfg11@duke.edu", "Test Email", "This is a test")
