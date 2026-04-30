FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Keep a copy of the default avatar outside /app/uploads (which is a mounted volume).
RUN mkdir -p /app/default-assets && cp /app/uploads/avatars/test.webp /app/default-assets/avatar-test.webp
RUN mkdir -p /app/default-assets && cp /app/uploads/images/shakshuka.webp /app/default-assets/shakshuka.webp

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "mkdir -p /app/uploads/avatars /app/uploads/images && [ -f /app/uploads/avatars/test.webp ] || cp /app/default-assets/avatar-test.webp /app/uploads/avatars/test.webp; [ -f /app/uploads/images/shakshuka.webp ] || cp /app/default-assets/shakshuka.webp /app/uploads/images/shakshuka.webp; npm start"]
