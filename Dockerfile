# Build stage
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_USE_MOCK="false"
ARG VITE_API_BASE_URL="http://localhost:8080"

ENV VITE_USE_MOCK=$VITE_USE_MOCK
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build


# Server stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]