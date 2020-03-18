import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class HyposoftLogin(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Safari()

    def test_search_in_python_org(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        login_page = WebDriverWait(driver, 1).until(
            EC.presence_of_element_located((By.ID, "login-grid"))
        )

        assert "Hyposoft" in driver.title

        username = driver.find_element_by_id("username-input")
        username.clear()
        username.send_keys("admin")

        time.sleep(0.1)

        password = driver.find_element_by_id("password-input")
        password.clear()
        password.send_keys("P8ssw0rd1!@")

        time.sleep(5)

        login_page.send_keys(Keys.RETURN)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "homepage"))
        )

        assert "Models" in self.driver.page_source

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
