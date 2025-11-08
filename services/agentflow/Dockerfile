FROM node:22-alpine

WORKDIR /app/services/agentflow

COPY services/agentflow/package.json services/agentflow/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY services/agentflow/. .
