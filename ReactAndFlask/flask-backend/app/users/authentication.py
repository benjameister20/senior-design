import datetime
import os

import bcrypt
import jwt


class AuthManager:
    """[summary]

    Returns:
        [type]: [description]
    """

    def __init__(self) -> None:
        self.TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY", "my_precious")

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

        return bcrypt.checkpw(encoded, actual)

    def encode_auth_token(self, username):
        """ Generate Auth Token

        Returns:
            str: Encoded token
        """

        try:
            payload = {
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=0, hours=2, minutes=0, seconds=0),
                "iat": datetime.datetime.utcnow(),
                "sub": username,
            }
            return jwt.encode(payload, self.TOKEN_SECRET_KEY, algorithm="HS256")
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
            print(payload)
            return payload["sub"]
        except jwt.ExpiredSignatureError:
            return "Session expired. Please log in again."
        except jwt.InvalidTokenError:
            return "Invalid token. Please log in again."


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
    print(token)
    print(auth.decode_auth_token(token))
