all: 	
	./tools/sql_run.sh ./tools/SQL/Is_up.sql

init: 
	./tools/sql_run.sh ./tools/SQL/DB_creation.sql
	./tools/sql_run.sh ./tools/SQL/Create_tables.sql
	./tools/sql_run.sh ./tools/SQL/Create_monitoring_user.sql
	./tools/sql_run.sh ./tools/SQL/imported_recipes.sql
	./tools/sql_run.sh ./tools/SQL/Ingredients_import.sql
	./tools/sql_import_recipes.sh
	./tools/sql_run.sh ./tools/SQL/Procedure.sql
	./tools/sql_run.sh ./tools/SQL/FixPrices.sql
	./tools/sql_run.sh ./tools/SQL/Triggers.sql
	./tools/create_admin.sh
	./tools/sql_run.sh ./tools/SQL/UpdateDiets.sql

clean:
	-docker-compose down --volumes --remove-orphans 2>/dev/null || true
	-docker-compose -p transcendence down --volumes --remove-orphans 2>/dev/null || true
	-docker rm -f brunchio_db 2>/dev/null || true
	-docker rm -f transcendence_pgadmin 2>/dev/null || true
	-docker rm -f database-postgres-1 2>/dev/null || true
	-docker rm -f database-pgadmin-1 2>/dev/null || true

clean_db:
	-docker-compose -f ../docker-compose.yml rm -sf postgres 2>/dev/null || true
	-docker rm -f brunchio_db 2>/dev/null || true
	-docker rm -f database-postgres-1 2>/dev/null || true

fclean: clean
	docker container prune -f
	docker image prune -af
	docker volume prune -af
	docker network prune -f
	docker system prune -af --volumes
	-docker volume ls -q | xargs -r docker volume rm -f 2>/dev/null || true

re: fclean all

.PHONY: all build up init clean clean_db fclean re
