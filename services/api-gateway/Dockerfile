FROM node:22-alpine

WORKDIR /app/services/api-gateway

COPY services/api-gateway/package.json services/api-gateway/package-lock.json ./

RUN npm ci

COPY services/api-gateway/. .

EXPOSE 3000
