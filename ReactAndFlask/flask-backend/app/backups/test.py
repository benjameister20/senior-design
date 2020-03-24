import smtplib

gmail_user = "hyposoftbackupsystems@gmail.com"
gmail_password = "P8ssw0rd1!@!"

sent_from = gmail_user
to = ["cfg11@duke.edu"]
subject = "test"
body = "test"

email_text = """\
From: %s
To: %s
Subject: %s

%s
""" % (
    sent_from,
    ", ".join(to),
    subject,
    body,
)

# try:
server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
server.ehlo()
server.login(gmail_user, gmail_password)
server.sendmail(sent_from, to, email_text)
server.close()

print("Email sent!")
# except:
#     print('Something went wrong...')
