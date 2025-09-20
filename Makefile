DC=docker compose

.PHONY: up down logs ps recreate

up:
	$(DC) up -d

down:
	$(DC) down

logs:
	$(DC) logs -f

ps:
	$(DC) ps

recreate:
	$(DC) down -v
	$(DC) up -d

