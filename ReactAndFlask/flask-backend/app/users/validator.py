import re


class Validator:
    def __init__(self) -> None:
        pass

    def validate_password(self, password: str) -> bool:
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
        results = re.search(pattern, password)

        return bool(results)

    def validate_email(self, email: str) -> bool:
        """ Validates email address using RFC 5322 Standard

        src: https://www.regular-expressions.info/email.html

        Args:
            email (str): Provided email address

        Returns:
            bool: True for successful validation, otherwise false
        """

        reg = r"\A[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\Z"
        pattern = re.compile(reg, re.IGNORECASE)
        results = re.search(pattern, email)

        return bool(results)

    def validate_username(self, username: str) -> bool:
        """ Validates username using following criteria:

        Username Criteria:
            - Between 4 and 20 characters
            - Contains only alphanumeric characters and ".", "_"
            - No "." or "_" at the beginning
            - No doubles of special characters (".." or "__")


        src: https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username/12019115

        Args:
            username (str): Provided username

        Returns:
            bool: True for successful validation, otherwise false
        """

        reg = "^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
        pattern = re.compile(reg)
        results = re.search(pattern, username)

        return bool(results)
