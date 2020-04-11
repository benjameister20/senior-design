"""
Script to query states of blades in a particular chassis
"""

import os
import re

chassis_name = "test"
os.system(f"./bmi-query.exp {chassis_name}")

states = {}
lines = []
with open("expect_log.log", "r") as f:
    lines = f.readlines()

pattern = re.compile("^  \\[(.+)\\] (.+)\\n$")
for line in lines:
    result = re.findall(pattern, line)[0]
    states[result[0]] = result[1]

print("")
print(states)
