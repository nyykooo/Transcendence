#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_DIR="${ROOT_DIR}/database"
FRONTEND_DIR="${ROOT_DIR}/frontend"

echo "Root directory: $ROOT_DIR"
echo "Database directory: $DB_DIR"
echo ""

mkdir -p "${FRONTEND_DIR}/tools/certs/"
mkdir -p "${DB_DIR}/tools/certs/postgres-ssl-certs"
mkdir -p "${DB_DIR}/tools/certs/pgadmin"


sudo chown $USER:$USER ${DB_DIR}/tools/certs 2>/dev/null || true

if [ -f ${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt ] && [ -f ${DB_DIR}/tools/certs/postgres-ssl-certs/server.key ]; then
  echo "Postgre SSL certs found"
  if [ -f ${DB_DIR}/tools/certs/pgadmin/server.cert ] && [ -f ${DB_DIR}/tools/certs/pgadmin/server.key ]; then
    echo "PGAdmin SSL certs also found"
    echo ""
    if [ -f ${FRONTEND_DIR}/tools/certs/server.key ] && [ -f ${FRONTEND_DIR}/tools/certs/server.crt ]; then
      echo "All certs already found"
      echo "EXITING..."
      exit 0
    fi
  fi
else
  echo "Creating Postgre SSL certificates"
  echo ""
  mkdir -p ${DB_DIR}/tools/certs/postgres-ssl-certs
  openssl req -x509 -newkey rsa:4096 \
  -keyout ${DB_DIR}/tools/certs/postgres-ssl-certs/server.key \
  -out ${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt \
  -days 365 \
  -nodes \
  -subj "/CN=postgres" \
  -addext "subjectAltName = DNS:postgres, DNS:localhost, IP:127.0.0.1"
  chmod 600 ${DB_DIR}/tools/certs/postgres-ssl-certs/server.key
  chmod 644 ${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt
  sudo chown -R 999:999 ${DB_DIR}/tools/certs/postgres-ssl-certs 2>/dev/null || true
fi


if [ -f ${DB_DIR}/tools/certs/pgadmin/server.cert ] && [ -f ${DB_DIR}/tools/certs/pgadmin/server.key ]; then
  echo "PGAdmin SSL certs found"
else
  echo "Creating PgAdmin SSL certificates"
  echo ""
  mkdir -p ${DB_DIR}/tools/certs/pgadmin
  openssl req -x509 -newkey rsa:4096 \
  -keyout ${DB_DIR}/tools/certs/pgadmin/server.key \
  -out ${DB_DIR}/tools/certs/pgadmin/server.cert \
  -days 365 \
  -nodes \
  -subj "/CN=pgadmin" \
  -addext "subjectAltName = DNS:pgadmin, DNS:localhost, IP:127.0.0.1"
  chmod 600 ${DB_DIR}/tools/certs/pgadmin/server.key
  chmod 644 ${DB_DIR}/tools/certs/pgadmin/server.cert

  sudo chown -R 5050:5050 ${DB_DIR}/tools/certs/pgadmin 2>/dev/null || true
fi

if [ -f ${FRONTEND_DIR}/tools/certs/server.key ] && [ -f ${FRONTEND_DIR}/tools/certs/server.crt ]; then
  echo "Frontend certificates created"
else
  echo "Creating Frontend SSL certificates"
  echo ""
  mkdir -p ${FRONTEND_DIR}/tools/certs/
  openssl req -x509 -newkey rsa:4096 \
  -keyout ${FRONTEND_DIR}/tools/certs/server.key \
  -out ${FRONTEND_DIR}/tools/certs/server.crt \
  -days 365 \
  -nodes \
  -subj "/CN=frontend" \
  -addext "subjectAltName = DNS:frontend, DNS:localhost, IP:127.0.0.1"
  chmod 600 ${FRONTEND_DIR}/tools/certs/server.key
  chmod 644 ${FRONTEND_DIR}/tools/certs/server.crt
  sudo chown -R ping:ping ${FRONTEND_DIR}/tools/certs/ 2>/dev/null || true
fi






