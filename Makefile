build-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build --remove-orphans

build-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --remove-orphans

up:
	docker-compose up

down:
	docker-compose down

down-V:
	docker-compose down -v

volume:
	docker volume inspect zenerprise_mongodb-data
