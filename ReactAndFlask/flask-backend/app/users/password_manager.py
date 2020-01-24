import re

import bcrypt


class PasswordManager:
    def __init__(self):
        pass

    def validate_pw(self, password):
        """Ensures password adheres to security guidelines:
            - Should have at least one number.
            - Should have at least one uppercase and one lowercase character.
            - Should have at least one special symbol.
            - Should be between 8 to 20 characters long.

            src: https://www.geeksforgeeks.org/password-validation-in-python/

        Args:
            password (string): Password to check

        Returns:
            Boolean: True if password adheres to guidelines, false if not
        """

        reg = (
            r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$"
        )
        pattern = re.compile(reg)

        return re.search(pattern, password)

    def encrypt_pw(self, password):
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

    def compare_pw(self, attempt, actual):
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


if __name__ == "__main__":
    pwmg = PasswordManager()
    pwd = "password"
    hashed_pwd = pwmg.encrypt_pw(pwd)
    attempt = "password"
    result = pwmg.compare_pw(attempt, hashed_pwd)
    print(result)
