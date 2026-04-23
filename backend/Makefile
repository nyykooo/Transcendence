
all: build
	@echo "Backend services are managed under backend/services via docker compose"

build:
	./check_install.sh

clean:
	rm -rf ./services/auth-service/node_modules ./services/recipes-service/node_modules ./services/api-gateway/node_modules

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
