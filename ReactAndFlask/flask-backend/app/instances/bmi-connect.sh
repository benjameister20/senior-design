#!/bin/bash


CHASSIS=$1
BLADENUM=$2
STATE=$3

expect -c "
    set timeout 9
    log_file expect_log.log
    spawn ssh -o StrictHostKeyChecking=no admin1@hyposoft-mgt.colab.duke.edu -p 2222
    expect -re \"^(.*?)password:\"
    send \"TMP!458\r\"
    expect -re \"^(.*?)m \"
    send \"chassis $CHASSIS\r\"
    send \"blade $BLADENUM\r\"
    send \"power $STATE\r\"
    send \"exit\r\"
"
