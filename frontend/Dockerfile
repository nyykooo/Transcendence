FROM node:22-alpine AS build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build # generates the dist folder

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx_conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443