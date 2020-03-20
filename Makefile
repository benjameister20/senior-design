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
		cd ReactAndFlask/reactfrontend && yarn install

.PHONY: dependencies
dependencies:
	pip freeze > requirements.in
	pip-compile

.PHONY: fix
fix:
	pre-commit run --all-files

.PHONY: run-all
run-all:
	cd ReactAndFlask/reactfrontend && yarn build
	rm -rf ReactAndFlask/flask-backend/static/* && rm -rf ReactAndFlask/flask-backend/templates/index.html
	cp -r ReactAndFlask/reactfrontend/build/static/* ReactAndFlask/flask-backend/static/
	cp ReactAndFlask/reactfrontend/build/index.html ReactAndFlask/flask-backend/templates/index.html
	python ./ReactAndFlask/flask-backend/application.py

.PHONY: run-back
run-back:
	python ./ReactAndFlask/flask-backend/application.py

.PHONY: run-front
run-front:
	cd ReactAndFlask/reactfrontend && yarn start

.PHONY: run-local
run-local:
	heroku local

.PHONY: setup-db-local
setup-db-local:
	. ReactAndFlask/flask-backend/scripts/setup_db_local.sh

.PHONY: create-db
create-db:
	. ReactAndFlask/flask-backend/scripts/setup_db.sh

.PHONY: users
users:
	python ReactAndFlask/flask-backend/scripts/user_setup.py

.PHONY: test
test:
	python -m pytest ReactAndFlask/flask-backend/app -p no:warnings --cov=ReactAndFlask/flask-backend/app --cov-report term-missing:skip-covered

.PHONY: test-ui
test-ui:
	cd ReactAndFlask/reactfrontend && ./node_modules/.bin/nightwatch

.PHONY: clean
clean:
	rm -rf .vscode/
	rm -rf .mypy_cache/
	rm -rf __pycache__
	rm -rf .pytest_cache
	find ReactAndFlask/flask-backend -type f -name '*.py[co]' -delete -o -type d -name __pycache__ -delete

.PHONY: clean-diagrams
clean-diagrams:
	find ReactAndFlask/flask-backend/static -type f -name '*.pdf' -delete

.PHONY: deploy-heroku
deploy-heroku:
	cd ~/ReactAndFlask/reactfrontend && yarn install
	cd ~/ReactAndFlask/reactfrontend && yarn build
	mkdir ~/ReactAndFlask/flask-backend/static/
	mkdir ~/ReactAndFlask/flask-backend/templates/
	cp -r ~/ReactAndFlask/reactfrontend/build/static/* ~/ReactAndFlask/flask-backend/static/
	cp ~/ReactAndFlask/reactfrontend/build/index.html ~/ReactAndFlask/flask-backend/templates/index.html

.PHONY: deploy
deploy:
	cd ./ReactAndFlask/reactfrontend && yarn install
	cd ./ReactAndFlask/reactfrontend && yarn build
	cp -r ./ReactAndFlask/reactfrontend/build/static/* ./ReactAndFlask/flask-backend/static/
	cp ./ReactAndFlask/reactfrontend/build/index.html ./ReactAndFlask/flask-backend/templates/index.html
