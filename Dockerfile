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
ARG AZURE_COSMOS_DB_COLLECTION=collection
ARG NODE_ENV=production
ARG AZURE_SERVICEBUS_ENDPOINT=sb_endpoint
ARG AZURE_SERVICEBUS_RECEIVE=sb_receive
ARG PORT=80
ENV NODE_ENV=${NODE_ENV}
ENV AZURE_COSMOS_DB_NAME=${AZURE_COSMOS_DB_NAME}
ENV AZURE_COSMOS_DB_ENDPOINT=${AZURE_COSMOS_DB_ENDPOINT}
ENV AZURE_COSMOS_DB_KEY=${AZURE_COSMOS_DB_KEY}
ENV AZURE_COSMOS_DB_COLLECTION=${AZURE_COSMOS_DB_COLLECTION}
ENV AZURE_SERVICEBUS_ENDPOINT=${AZURE_SERVICEBUS_ENDPOINT}
ENV AZURE_SERVICEBUS_RECEIVE=${AZURE_SERVICEBUS_RECEIVE}
ENV PORT=${PORT}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production
COPY . .
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE ${PORT}
EXPOSE 443

CMD ["node", "dist/main"]
