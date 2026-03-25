#!/bin/bash

# Create directories if they don't exist
mkdir -p ./certs/postgres-ssl-certs
mkdir -p ./certs/pgadmin

# Generate/certs PostgreSQL server certificate (self-signed)
openssl req -x509 -newkey rsa:4096 \
  -keyout ./certs/postgres-ssl-certs/server.key \
  -out ./certs/postgres-ssl-certs/server.crt \
  -days 365 \
  -nodes \
  -subj "/CN=postgres" \
  -addext "subjectAltName = DNS:postgres, DNS:localhost, IP:127.0.0.1"

# Set proper permissions for PostgreSQL (requires 600 for key, 644 for cert)
chmod 600 ./certs/postgres-ssl-certs/server.key
chmod 644 ./certs/postgres-ssl-certs/server.crt

# Generate pgAdmin server certificate (pgAdmin acts as the server, not client)
openssl req -x509 -newkey rsa:4096 \
  -keyout ./certs/pgadmin/server.key \
  -out ./certs/pgadmin/server.cert \
  -days 365 \
  -nodes \
  -subj "/CN=pgadmin" \
  -addext "subjectAltName = DNS:pgadmin, DNS:localhost, IP:127.0.0.1"

# Set permissions for pgAdmin (container runs as user 5050:5050)
chmod 600 ./certs/pgadmin/server.key
chmod 644 ./certs/pgadmin/server.cert

# Ensure correct ownership for pgAdmin (optional, container will handle if not set)
sudo chown -R 5050:5050 ./certs/pgadmin 2>/dev/null || true
sudo chown -R 999:999 ./certs/postgres-ssl-certs