FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
RUN npm install prom-client

COPY . .

ENV NODE_ENV=production
EXPOSE 3443

CMD ["npm", "start"]
