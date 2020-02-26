import os

from dotenv import load_dotenv

load_dotenv()


TEST_DB_URL: str = os.environ.get("TEST_DB_URL", "postgres://localhost/test")
