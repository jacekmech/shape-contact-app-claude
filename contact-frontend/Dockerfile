FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src ./src

CMD ["npm", "run", "dev", "--", "--host"]
