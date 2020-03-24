""" Code for GMAIL integration taken from Google API sample docs
    https://developers.google.com/gmail/api/quickstart/python
    https://developers.google.com/gmail/api/v1/reference/users/messages/send

"""
from __future__ import print_function

import os
import smtplib

CONTEXT = os.path.dirname(__file__)


# class EmailManager:
#     def __init__(self):
#         self.service = self.service_account_login()

#     def create_message(self, sender, to, subject, message_text):
#         """Create a message for an email.
#         Args:
#             sender: Email address of the sender.
#             to: Email address of the receiver.
#             subject: The subject of the email message.
#             message_text: The text of the email message.
#         Returns:
#             An object containing a base64url encoded email object.
#         """
#         message = MIMEText(message_text)
#         message["to"] = to
#         message["from"] = sender
#         message["subject"] = subject

#         return {
#             "raw": str(base64.urlsafe_b64encode(message.as_string().encode("utf-8")))
#         }

#     def send_message(self, service, user_id, message):
#         """Send an email message.
#         Args:
#             service: Authorized Gmail API service instance.
#             user_id: User's email address. The special value "me"
#             can be used to indicate the authenticated user.
#             message: Message to be sent.
#         Returns:
#             Sent Message.
#         """

#         print(message)
#         try:
#             message = (
#                 self.service.users()
#                 .messages()
#                 .send(userId=user_id, body=message)
#                 .execute()
#             )
#             print("Message Id: %s" % message["id"])
#             return message
#         except errors.HttpError as error:
#             print("An error occurred: %s" % error)

#     def service_account_login(self):
#         SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
#         SERVICE_ACCOUNT_FILE = f"{CONTEXT}/cryptic-album-272004-3b0f2c403b5a.json"

#         credentials = service_account.Credentials.from_service_account_file(
#             SERVICE_ACCOUNT_FILE, scopes=SCOPES
#         )
#         delegated_credentials = credentials.with_subject(EMAIL_FROM)
#         service = build("gmail", "v1", credentials=delegated_credentials)

#         return service

#     def send_email(self, sender, to, subject, message):
#         message = self.create_message(sender, to, subject, message)
#         self.send_message(self.service, "me", message)

#         return None


if __name__ == "__main__":
    # Email variables. Modify this!
    # EMAIL_FROM = 'hyposoftbackupservice@gmail.com'
    # EMAIL_TO = 'cfg11@duke.edu'
    # EMAIL_SUBJECT = 'Hello from hyposoft!'
    # EMAIL_CONTENT = 'Hello, this is a test'

    # em = EmailManager()
    # # Call the Gmail API
    # em.send_email(EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_CONTENT)
    email_acct = "hyposoftbackupsystems@gmail.com"
    pswd = "P8ssw0rd1!@"
    # creates SMTP session
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.ehlo()
    server.login(email_acct, pswd)

    # message to be sent
    message = "Message_you_need_to_send"

    # sending the mail
    server.sendmail(email_acct, "cfg11@duke.edu", message)

    # terminating the session
    server.close()
