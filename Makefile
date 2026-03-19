.PHONY: all build up start down stop restart 

all: build up
build:
	docker-compose -p inception -f ./docker-compose.yml build
up:
	docker-compose -f ./docker-compose.yml up -d
start:
	docker-compose -f ./docker-compose.yml start
down:
	docker-compose -f ./docker-compose.yml down -v --remove-orphans
stop:
	docker-compose -f ./docker-compose.yml stop
restart:
	docker-compose -f ./docker-compose.yml restart
prune:
	docker system prune --all --volumes --force \
	&& docker volume ls -q | xargs -r docker volume rm
prune_net:
	docker network prune --force

fclean: down prune prune_net

re: fclean build up

logs:
	cd srcs && docker-compose logs