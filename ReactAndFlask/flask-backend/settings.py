import os

from dotenv import load_dotenv

load_dotenv()


TEST_DB_URL: str = os.environ["TEST_DB_URL"]
