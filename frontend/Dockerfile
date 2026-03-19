FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

COPY ./tools/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]