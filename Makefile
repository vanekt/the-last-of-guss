DC=docker compose -f docker-compose.dev.yml

.PHONY: up down logs ps recreate release

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

release:
	@if [ -z "$(VERSION)" ]; then echo "Usage: make release VERSION=0.1.3"; exit 1; fi
	npm --prefix backend version $(VERSION) --no-git-tag-version --allow-same-version
	npm --prefix frontend version $(VERSION) --no-git-tag-version --allow-same-version
	git add backend/package.json frontend/package.json
	git commit -m "release: v$(VERSION)"
	git tag v$(VERSION)
	@echo ""
	@echo "Done. Review with 'git log -1' / 'git tag', then push:"
	@echo "  git push && git push origin v$(VERSION)"

