
FROM node:14-alpine3.10 as builder

LABEL version="1.0"
LABEL description="Zenerprise Frontend"

WORKDIR /app

COPY ./package.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

FROM nginx:1.21.1

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder ./app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
