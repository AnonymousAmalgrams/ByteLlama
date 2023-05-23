# syntax=docker/dockerfile:1
FROM node:16-alpine3.16

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT
ENV HOST = 0.0.0.0

CMD npm run dev