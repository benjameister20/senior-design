.PHONY: help
help:
	@echo ""
	@echo "\t install \t\t\t\t reinstall venv, dependencies, and pre-commit"
	@echo "\t dependencies \t\t\t\t store dependencies in requirements"
	@echo "\t fix \t\t\t\t\t runs pre-commit on all files"
	@echo "\t run \t\t\t\t\t runs server locally"
	@echo "\t clean \t\t\t\t\t cleans up files"
	@echo ""

.PHONY: install
install:
	rm -rf .venv
	python3 -m venv .venv
	. .venv/bin/activate &&\
		pip install --upgrade pip &&\
		pip install -r requirements.txt &&\
		pre-commit install &&\
		pre-commit autoupdate &&\
		cd ReactAndFlask/react-frontend && yarn install

.PHONY: dependencies
dependencies:
	pip freeze > requirements.in
	pip-compile

.PHONY: fix
fix:
	pre-commit run --all-files

.PHONY: run-all
run-all:
	cd ReactAndFlask/react-frontend && npm run build -dd
	python ./ReactAndFlask/flask-backend/application.py

.PHONY: run-back
run-back:
	python ./ReactAndFlask/flask-backend/application.py

.PHONY: run-front
run-front:
	cd ReactAndFlask/react-frontend && npm build && npm start

.PHONY: run-local
run-local:
	heroku local

.PHONY: setup-db
setup-db:
	. ReactAndFlask/flask-backend/scripts/setup_db.sh

.PHONY: users
users:
	python ReactAndFlask/flask-backend/scripts/user_setup.py

.PHONY: test
test:
	python -m pytest

.PHONY: clean
clean:
	rm -rf .vscode/
	rm -rf .mypy_cache/
	rm -rf __pycache__
	rm -rf .pytest_cache
	find ReactAndFlask/flask-backend/app -type f -name '*.py[co]' -delete -o -type d -name __pycache__ -delete
