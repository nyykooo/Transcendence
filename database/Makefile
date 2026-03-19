all: up
	./tools/sql_run.sh ./tools/SQL/Is_up.sql

build: up init

up:
	docker-compose up -d

init: up
	./tools/sql_run.sh ./tools/SQL/DB_creation.sql
	./tools/sql_run.sh ./tools/SQL/Create_tables.sql
	./tools/sql_run.sh ./tools/SQL/Ingredients_import.sql

clean:
	-docker-compose down --volumes --remove-orphans 2>/dev/null || true
	-docker-compose -p transcendence down --volumes --remove-orphans 2>/dev/null || true
	-docker rm -f brunchio_db 2>/dev/null || true
	-docker rm -f transcendence_pgadmin 2>/dev/null || true
	-docker rm -f database-postgres-1 2>/dev/null || true
	-docker rm -f database-pgadmin-1 2>/dev/null || true

fclean: clean
	docker container prune -f
	docker image prune -af
	docker volume prune -af
	docker network prune -f
	docker system prune -af --volumes
	-docker volume ls -q | xargs -r docker volume rm -f 2>/dev/null || true

re: fclean build

.PHONY: all build up init clean fclean re
