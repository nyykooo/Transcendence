CURRENT_DIR := $(shell pwd)

-include .env

ROOT_DIR := $(CURRENT_DIR)
DB_DIR := $(ROOT_DIR)/database
BACKEND_DIR := $(ROOT_DIR)/backend
FRONTEND_DIR := $(ROOT_DIR)/frontend


.PHONY: all build up start down stop restart dev-frontend-local dev-frontend-run

all: build up submakes

certs:
	./gen_certs.sh
	@echo ""
	@echo "Certificates generated"
	@echo ""

submakes:

	$(MAKE) -C $(BACKEND_DIR)  || true
	$(MAKE) -C $(DB_DIR) init || true
	$(MAKE) -C $(DB_DIR)  || true

build: certs
	docker-compose -p brunchio -f ./docker-compose.yml build
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

re: fclean all

logs:
	cd srcs && docker-compose logs

dev:
	docker-compose -f ./docker-compose.yml up -d api auth-service recipes-service postgres redis pgadmin

build_dev: certs
	docker-compose -p brunchio -f ./docker-compose.yml build api auth-service recipes-service postgres redis pgadmin

# Frontend local development mode
# Runs backend services in containers, frontend locally on port 3000
dev-frontend-local: down build_dev dev submakes dev-frontend-run

dev-frontend-run:
	cd $(FRONTEND_DIR) && npm install && PORT=3000 npm run dev:ssr