
all: recipes auth

recipes:
	npm --prefix ./Recipes ci

auth:
	npm --prefix ./Auth ci

clean:
	rm -rf ./Recipes/node_modules ./Auth/node_modules

docker_build:
	docker compose -f docker-compose.yml build

docker_up:
	docker compose -f docker-compose.yml up -d

docker_down:
	docker compose -f docker-compose.yml down -v --remove-orphans

docker_logs:
	docker compose -f docker-compose.yml logs -f
.PHONY: all recipes auth clean docker_build docker_up docker_down docker_logs