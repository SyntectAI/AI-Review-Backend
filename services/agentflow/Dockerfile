FROM node:22-alpine

WORKDIR /app/services/agentflow

COPY services/agentflow/package.json services/agentflow/package-lock.json ./

RUN npm ci

COPY services/agentflow/. .

EXPOSE 50052