
all: up
	./tools/sql_run.sh ./tools/SQL/Is_up.sql

build: up init

up:
	docker-compose up -d

init: up

	./tools/sql_run.sh ./tools/SQL/DB_creation.sql
	./tools/sql_run.sh ./tools/SQL/Create_tables.sql
	./tools/sql_run.sh ./tools/SQL/Ingredients_import.sql
	./tools/sql_run.sh ./tools/SQL/views.sql
