# Development image
FROM node:20 as dev

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "start:dev"]

# Production image
FROM node:20-alpine as prod

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]