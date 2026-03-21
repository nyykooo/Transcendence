
all: recipes auth

recipes:
	npm --prefix ./Recipes ci

auth:
	npm --prefix ./Auth ci

clean:
	rm -rf ./Recipes/node_modules ./Auth/node_modules
.PHONY: all recipes auth clean