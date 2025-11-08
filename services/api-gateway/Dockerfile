FROM node:22-alpine

WORKDIR /app/services/api-gateway

COPY services/api-gateway/package.json ./

RUN npm install

COPY services/api-gateway/. .

EXPOSE 3000
