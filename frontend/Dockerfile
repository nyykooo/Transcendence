FROM node:22-alpine AS build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build          # gera /app/dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx_conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443