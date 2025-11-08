FROM node:22-alpine

WORKDIR /app/services/auth-service

COPY services/auth-service/package.json ./

RUN npm install

COPY services/auth-service/prisma ./prisma

RUN npx prisma generate

COPY services/auth-service/. .

EXPOSE 3001
