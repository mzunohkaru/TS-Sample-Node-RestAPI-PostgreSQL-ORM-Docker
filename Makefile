.PHONY: setup up d b ps node

setup:
	@make up
	@make ps

rebuild:
	@make d
	@make cache
	@make up

d:
	docker-compose down

up:
	docker-compose up --build

ps:
	docker-compose ps

# Dockerコンテナ内のnodeサービスにbashシェルで接続します
node:
	docker-compose exec node bash

psgl:
	docker-compose exec db psql -U user -d dev -W

cache:
	docker-compose build --no-cache