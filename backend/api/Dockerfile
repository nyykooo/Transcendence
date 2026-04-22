FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure uploads directory exists (test.webp bundled from COPY .)
RUN mkdir -p /app/uploads/avatars

ENV NODE_ENV=production
EXPOSE 3443

CMD ["npm", "start"]
