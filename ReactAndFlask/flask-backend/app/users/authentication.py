import datetime
import os
import time

import bcrypt
import jwt


class AuthManager:
    def __init__(self) -> None:
        self.TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY", "my_precious")
        self.TOKEN_EXP_DAYS = 0
        self.TOKEN_EXP_HOURS = 2
        self.TOKEN_EXP_MINUTES = 0
        self.TOKEN_EXP_SECONDS = 0
        self.SESSION_EXPIRED = "Session expired. Please log in again."
        self.INVALID_TOKEN = "Invalid token. Please log in again."
        # print(self.encode_auth_token("mark"))

    def encrypt_pw(self, password: str) -> str:
        """Encrypts a user password using bcrypt algorithm

        src: http://zetcode.com/python/bcrypt/

        Args:
            password (string): Password to encrypt

        Returns:
            String: Encrypted password
        """

        encoded = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(encoded, salt)

        return hashed

    def compare_pw(self, attempt: str, actual: str) -> bool:
        """Checks for password matches

        src: http://zetcode.com/python/bcrypt/

        Args:
            attempt (string): Direct password string from login attempt
            actual (byte string): Password stored in database (as byte string)

        Returns:
            Boolean: True if passwords match, false if not
        """

        encoded = attempt.encode("utf-8")
        encodedAct = actual.encode("utf-8")

        return bcrypt.checkpw(encoded, encodedAct)

    def encode_auth_token(self, username: str):
        """ Generate Auth Token

        Returns:
            str: Encoded token
        """

        try:
            payload = {
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(
                    days=self.TOKEN_EXP_DAYS,
                    hours=self.TOKEN_EXP_HOURS,
                    minutes=self.TOKEN_EXP_MINUTES,
                    seconds=self.TOKEN_EXP_SECONDS,
                ),
                "iat": datetime.datetime.utcnow(),
                "sub": username,
            }
            token = jwt.encode(
                payload, self.TOKEN_SECRET_KEY, algorithm="HS256"
            ).decode("utf-8")
            return token
        except Exception as e:
            return e

    def decode_auth_token(self, auth_token):
        """ Decodes Auth Token

        Args:
            auth_token (str): Proposed auth token

        Returns:
            str: Confirms or denies authentication
        """
        try:
            payload = jwt.decode(auth_token, self.TOKEN_SECRET_KEY)
            return payload["sub"]
        except jwt.ExpiredSignatureError:
            return self.SESSION_EXPIRED
        except jwt.InvalidTokenError:
            return self.INVALID_TOKEN

    def validate_auth_token(self, headers):

        try:
            auth_token = headers["token"]
        except KeyError:
            return [False, "Please provide auth token"]

        decoded = self.decode_auth_token(auth_token)
        if decoded == self.SESSION_EXPIRED:
            return [False, self.SESSION_EXPIRED]
        elif decoded == self.INVALID_TOKEN:
            return [False, self.INVALID_TOKEN]
        else:
            return [True, "Token is valid"]


if __name__ == "__main__":
    # pwmg = PasswordManager()
    # pwd = "password"
    # hashed_pwd = pwmg.encrypt_pw(pwd)
    # attempt = "password"
    # result = pwmg.compare_pw(attempt, hashed_pwd)
    # print(result)
    # print(pwmg.validate_pw(pwd))
    # print(pwmg.validate_pw("password1!"))
    # s = "Ben@gmail.com"
    # reg = r"\A[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\Z"
    # pattern = re.compile(reg, re.IGNORECASE)
    # results = re.search(pattern, s)
    auth = AuthManager()
    token = auth.encode_auth_token("mack")
    time.sleep(3)
    print(token)
    print(auth.validate_auth_token(token))
