#!/usr/bin/env bash

dropdb test
createdb test
python ReactAndFlask/flask-backend/scripts/create_db.py
