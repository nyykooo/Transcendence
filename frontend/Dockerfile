FROM node:22-alpine AS build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build # generates the dist folder

FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/index.html ./index.html
COPY --from=build /app/nginx_conf ./nginx_conf
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/vite.config.ts ./vite.config.ts

ENV NODE_ENV=production
ENV PORT=1025

EXPOSE 1025

CMD ["node", "server.mjs"]