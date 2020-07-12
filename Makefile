all:
	@echo "Hello $(LOGNAME), nothing to do by default"
	@echo "Try 'make help'"

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

validate_env:
	@command -v docker > /dev/null || (echo "You need to install docker and docker-compose before proceeding" && exit 1)
	@command -v docker-compose > /dev/null || (echo "You need to install docker and docker-compose before proceeding" && exit 1)

build: delete-container ## Build the container
	@[ -f .env ] || cp template.env .env
	@docker network create nginx-gateway || true
	@docker-compose up --build -d

build_and_test: build ## Build containers and run tests
	@docker-compose exec backend pytest

test: start ## Run tests
	@docker-compose exec backend pytest

restart: ## Restart the container
	@docker-compose restart

cmd: start ## Access bash
	@docker-compose exec backend /bin/bash

up: start ## Start Fastapi dev server
	@docker-compose exec backend uvicorn backend.app.api:app --host 0.0.0.0 --reload

start:
	@docker-compose start

down: ## Stop container
	@docker-compose stop || true

delete-container: down
	@docker-compose down || true

remove: delete-container ## Delete containers and images

docs: start
	@docker-compose exec backend pdoc --html backend/app -o docs --force

.DEFAULT_GOAL := help
