FROM node:alpine as builder
MAINTAINER Lukas Braun

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install --only=development

COPY . .
RUN npm run build

FROM node:alpine as production
ARG AZURE_COSMOS_DB_NAME=name
ARG AZURE_COSMOS_DB_ENDPOINT=endpoint
ARG AZURE_COSMOS_DB_KEY=key
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV AZURE_COSMOS_DB_NAME=${AZURE_COSMOS_DB_NAME}
ENV AZURE_COSMOS_DB_ENDPOINT=${AZURE_COSMOS_DB_ENDPOINT}
ENV AZURE_COSMOS_DB_KEY=${AZURE_COSMOS_DB_KEY}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production
COPY . .
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
