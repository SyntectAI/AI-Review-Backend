FROM node:22-alpine

WORKDIR /app/services/agentflow

COPY services/agentflow/package.json ./

RUN npm install

COPY services/agentflow/. .
