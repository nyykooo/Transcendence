.PHONY: all install run clean re

FRONTEND_DIR = ./frontend

all: install run

install:
# add to Dockerfile: npm install -g yarn
	cd $(FRONTEND_DIR) && yarn install --frozen-lockfile

run:
	cd $(FRONTEND_DIR) && yarn run dev

clean:
	rm -rf $(FRONTEND_DIR)/node_modules

re: clean install run