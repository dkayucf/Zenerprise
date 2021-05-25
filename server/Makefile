build-dev:
	docker-compose up --build --remove-orphans

build-prod:
	docker-compose up --build --remove-orphans --scale zenerprise-api=5

up:
	docker-compose up

down:
	docker-compose down

down-V:
	docker-compose down -v

volume:
	docker volume inspect zenerprise_mongodb-data
