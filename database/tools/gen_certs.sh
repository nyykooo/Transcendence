#!/bin/bash


if [ -f ./tools/certs/postgres-ssl-certs/server.crt ] && [ -f ./tools/certs/postgres-ssl-certs/server.key ]; then
  echo "Postgre SSL certs found"
  if [ -f ./tools/certs/pgadmin/server.cert ] && [ -f ./tools/certs/pgadmin/server.key ]; then
    echo "PGAdmin SSL certs also found"
    echo ""
    echo "EXITING..."
    exit 0
  fi
else
  echo "Creating Postgre SSL certificates"
  mkdir -p ./tools/certs/postgres-ssl-certs
  openssl req -x509 -newkey rsa:4096 \
  -keyout ./tools/certs/postgres-ssl-certs/server.key \
  -out ./tools/certs/postgres-ssl-certs/server.crt \
  -days 365 \
  -nodes \
  -subj "/CN=postgres" \
  -addext "subjectAltName = DNS:postgres, DNS:localhost, IP:127.0.0.1"
  chmod 600 ./tools/certs/postgres-ssl-certs/server.key
  chmod 644 ./tools/certs/postgres-ssl-certs/server.crt
  sudo chown -R 999:999 ./tools/certs/postgres-ssl-certs 2>/dev/null || true
fi


if [ -f ./tools/certs/pgadmin/server.cert ] && [ -f ./tools/certs/pgadmin/server.key ]; then
  echo "PGAdmin SSL certs found"
else
  mkdir -p ./tools/certs/pgadmin
  openssl req -x509 -newkey rsa:4096 \
  -keyout ./tools/certs/pgadmin/server.key \
  -out ./tools/certs/pgadmin/server.cert \
  -days 365 \
  -nodes \
  -subj "/CN=pgadmin" \
  -addext "subjectAltName = DNS:pgadmin, DNS:localhost, IP:127.0.0.1"
  chmod 600 ./tools/certs/pgadmin/server.key
  chmod 644 ./tools/certs/pgadmin/server.cert

  sudo chown -R 5050:5050 ./tools/certs/pgadmin 2>/dev/null || true
fi







