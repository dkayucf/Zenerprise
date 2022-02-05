# specify base image from dockerhub
FROM node:14-alpine3.10

LABEL version="1.0"
LABEL description="Zenerprise backend server"

# workdir is where our code shall live in the container
# all commands executed relative to this directory
WORKDIR /app

COPY ["package.json","package-lock.json*","npm-shrinkwrap.json*", "./"]

ARG NODE_ENV
# Install dependencies and clear npm cache
RUN if [ "$NODE_ENV" = "development" ]; \
  then npm install; \
  else npm install --only=production; \
  fi

COPY . .

# use EXPOSE command to have our port mapped by the docker daemon
EXPOSE 5000
