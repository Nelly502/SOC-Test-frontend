FROM node:18.10-slim as base
WORKDIR /app 
COPY package.json /app 
COPY yarn.lock /app
RUN yarn install --frozen-lockfile
COPY . /app

FROM base as build
LABEL stage=testing
WORKDIR /app
RUN yarn build

FROM base as lint
WORKDIR /app
RUN yarn lint
