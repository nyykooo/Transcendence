FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Keep a copy of the default avatar outside /app/uploads (which is a mounted volume).
RUN mkdir -p /app/default-assets && cp /app/uploads/avatars/test.webp /app/default-assets/test.webp

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "mkdir -p /app/uploads/avatars && [ -f /app/uploads/avatars/test.webp ] || cp /app/default-assets/test.webp /app/uploads/avatars/test.webp; npm start"]
