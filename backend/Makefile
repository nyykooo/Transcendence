
all: build
	npm install --prefix ./api

build:
	./check_install.sh

clean:
	rm -rf ./api/node_modules

docker_build:
	docker compose -f docker-compose.yml build

docker_up:
	docker compose -f docker-compose.yml up -d

docker_down:
	docker compose -f docker-compose.yml down -v --remove-orphans

docker_logs:
	docker compose -f docker-compose.yml logs -f

re: docker_down clean all

.PHONY: all clean docker_build docker_up docker_down docker_logs re
