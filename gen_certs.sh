#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_DIR="${ROOT_DIR}/database"
FRONTEND_DIR="${ROOT_DIR}/frontend"
DEVOPS_DIR="${ROOT_DIR}/monitoring"

echo "Root directory: $ROOT_DIR"
echo "Database directory: $DB_DIR"
echo "Monitoring directory: $DEVOPS_DIR"
echo ""

mkdir -p "${FRONTEND_DIR}/tools/certs"
mkdir -p "${DB_DIR}/tools/certs/postgres-ssl-certs"
mkdir -p "${DB_DIR}/tools/certs/pgadmin"
mkdir -p "${DEVOPS_DIR}/tools/certs/prometheus"
mkdir -p "${DEVOPS_DIR}/tools/certs/grafana"
mkdir -p "${DEVOPS_DIR}/tools/certs/postgres_exporter"
mkdir -p "${DEVOPS_DIR}/tools/certs/filebeat"
mkdir -p "${DEVOPS_DIR}/tools/certs/logstash"
mkdir -p "${DEVOPS_DIR}/tools/certs/elk-ca"
mkdir -p "${DEVOPS_DIR}/tools/certs/elasticsearch"
mkdir -p "${DEVOPS_DIR}/tools/certs/kibana"

sudo chown "$USER:$USER" "${DB_DIR}/tools/certs" 2>/dev/null || true
sudo chown "$USER:$USER" "${DEVOPS_DIR}/tools/certs" 2>/dev/null || true
sudo chown "$USER:$USER" "${FRONTEND_DIR}/tools/certs" 2>/dev/null || true

# Exit only if ALL certs already exist
if [ -f "${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt" ] && \
   [ -f "${DB_DIR}/tools/certs/postgres-ssl-certs/server.key" ] && \
   [ -f "${DB_DIR}/tools/certs/pgadmin/server.cert" ] && \
   [ -f "${DB_DIR}/tools/certs/pgadmin/server.key" ] && \
   [ -f "${FRONTEND_DIR}/tools/certs/server.crt" ] && \
   [ -f "${FRONTEND_DIR}/tools/certs/server.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/grafana/grafana.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/grafana/grafana.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/filebeat/filebeat.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/filebeat/filebeat.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/logstash/logstash.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/logstash/logstash.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.key" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/kibana/kibana.crt" ] && \
   [ -f "${DEVOPS_DIR}/tools/certs/kibana/kibana.key" ]; then
  echo "All certificates already found"
  echo "EXITING..."
  exit 0
fi

if [ -f "${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt" ] && [ -f "${DB_DIR}/tools/certs/postgres-ssl-certs/server.key" ]; then
  echo "Postgre SSL certs found"
else
  echo "Creating Postgre SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${DB_DIR}/tools/certs/postgres-ssl-certs/server.key" \
    -out "${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt" \
    -days 365 \
    -nodes \
    -subj "/CN=postgres" \
    -addext "subjectAltName = DNS:postgres, DNS:localhost, IP:127.0.0.1"
  chmod 777 "${DB_DIR}/tools/certs/postgres-ssl-certs/server.key"
  chmod 777 "${DB_DIR}/tools/certs/postgres-ssl-certs/server.crt"
  chown -R 999:999 "${DB_DIR}/tools/certs/postgres-ssl-certs" 2>/dev/null || true
fi

if [ -f "${DB_DIR}/tools/certs/pgadmin/server.cert" ] && [ -f "${DB_DIR}/tools/certs/pgadmin/server.key" ]; then
  echo "PGAdmin SSL certs found"
else
  echo "Creating PgAdmin SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${DB_DIR}/tools/certs/pgadmin/server.key" \
    -out "${DB_DIR}/tools/certs/pgadmin/server.cert" \
    -days 365 \
    -nodes \
    -subj "/CN=pgadmin" \
    -addext "subjectAltName = DNS:pgadmin, DNS:localhost, IP:127.0.0.1"
  chmod 777 "${DB_DIR}/tools/certs/pgadmin/server.key"
  chmod 777 "${DB_DIR}/tools/certs/pgadmin/server.cert"
  chown -R 5050:5050 "${DB_DIR}/tools/certs/pgadmin" 2>/dev/null || true
fi

if [ -f "${FRONTEND_DIR}/tools/certs/server.key" ] && [ -f "${FRONTEND_DIR}/tools/certs/server.crt" ]; then
  echo "Frontend certificates found"
else
  echo "Creating Frontend SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${FRONTEND_DIR}/tools/certs/server.key" \
    -out "${FRONTEND_DIR}/tools/certs/server.crt" \
    -days 365 \
    -nodes \
    -subj "/CN=frontend" \
    -addext "subjectAltName = DNS:frontend, DNS:localhost, IP:127.0.0.1"
  chmod 777 "${FRONTEND_DIR}/tools/certs/server.key"
  chmod 777 "${FRONTEND_DIR}/tools/certs/server.crt"
  chown -R ping:ping "${FRONTEND_DIR}/tools/certs" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.key" ]; then
  echo "Prometheus SSL certs found"
else
  echo "Creating Prometheus SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.key" \
    -out "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.crt" \
    -days 365 \
    -nodes \
    -subj "/CN=prometheus" \
    -addext "subjectAltName = DNS:prometheus, DNS:localhost, IP:127.0.0.1"
  chmod 600 "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/prometheus/prometheus.crt"
  sudo chown -R 65534:65534 "${DEVOPS_DIR}/tools/certs/prometheus" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/grafana/grafana.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/grafana/grafana.key" ]; then
  echo "Grafana SSL certs found"
else
  echo "Creating Grafana SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${DEVOPS_DIR}/tools/certs/grafana/grafana.key" \
    -out "${DEVOPS_DIR}/tools/certs/grafana/grafana.crt" \
    -days 365 \
    -nodes \
    -subj "/CN=grafana" \
    -addext "subjectAltName = DNS:grafana, DNS:localhost, IP:127.0.0.1"
  chmod 600 "${DEVOPS_DIR}/tools/certs/grafana/grafana.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/grafana/grafana.crt"
  sudo chown -R 472:472 "${DEVOPS_DIR}/tools/certs/grafana" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.key" ]; then
  echo "postgres_exporter SSL certs found"
else
  echo "Creating postgres_exporter SSL certificates"
  echo ""
  openssl req -x509 -newkey rsa:4096 \
    -keyout "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.key" \
    -out "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.crt" \
    -days 365 \
    -nodes \
    -subj "/CN=postgres_exporter" \
    -addext "subjectAltName = DNS:postgres_exporter, DNS:localhost, IP:127.0.0.1"
  chmod 600 "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/postgres_exporter/postgres_exporter.crt"
  sudo chown -R 65534:65534 "${DEVOPS_DIR}/tools/certs/postgres_exporter" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" ]; then
  echo "ELK CA found"
else
  echo "Creating ELK CA"
  echo ""

  openssl genrsa -out "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" 4096

  openssl req -x509 -new -nodes \
    -key "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" \
    -sha256 \
    -days 365 \
    -out "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" \
    -subj "/CN=transcendence-elk-ca"

  chmod 600 "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt"
fi

if [ -f "${DEVOPS_DIR}/tools/certs/logstash/logstash.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/logstash/logstash.key" ]; then
  echo "Logstash SSL certs found"
else
  echo "Creating Logstash SSL certificates"
  echo ""

  openssl req -newkey rsa:4096 -nodes \
    -keyout "${DEVOPS_DIR}/tools/certs/logstash/logstash.key" \
    -out "${DEVOPS_DIR}/tools/certs/logstash/logstash.csr" \
    -subj "/CN=logstash"

  openssl x509 -req \
    -in "${DEVOPS_DIR}/tools/certs/logstash/logstash.csr" \
    -CA "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" \
    -CAkey "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" \
    -CAcreateserial \
    -out "${DEVOPS_DIR}/tools/certs/logstash/logstash.crt" \
    -days 365 \
    -sha256 \
    -extfile <(printf "subjectAltName=DNS:logstash,DNS:localhost,IP:127.0.0.1")

  rm -f "${DEVOPS_DIR}/tools/certs/logstash/logstash.csr"

  chmod 640 "${DEVOPS_DIR}/tools/certs/logstash/logstash.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/logstash/logstash.crt"
  sudo chown -R 1000:1000 "${DEVOPS_DIR}/tools/certs/logstash" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.key" ]; then
  echo "Elasticsearch SSL certs found"
else
  echo "Creating Elasticsearch SSL certificates"
  echo ""

  openssl req -newkey rsa:4096 -nodes \
    -keyout "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.key" \
    -out "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.csr" \
    -subj "/CN=elasticsearch"

  openssl x509 -req \
    -in "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.csr" \
    -CA "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" \
    -CAkey "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" \
    -CAcreateserial \
    -out "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.crt" \
    -days 365 \
    -sha256 \
    -extfile <(printf "subjectAltName=DNS:elasticsearch,DNS:localhost,IP:127.0.0.1")

  rm -f "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.csr"

  chmod 640 "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/elasticsearch/elasticsearch.crt"
  sudo chown -R 1000:0 "${DEVOPS_DIR}/tools/certs/elasticsearch" 2>/dev/null || true
fi

if [ -f "${DEVOPS_DIR}/tools/certs/kibana/kibana.crt" ] && [ -f "${DEVOPS_DIR}/tools/certs/kibana/kibana.key" ]; then
  echo "Kibana SSL certs found"
else
  echo "Creating Kibana SSL certificates"
  echo ""

  openssl req -newkey rsa:4096 -nodes \
    -keyout "${DEVOPS_DIR}/tools/certs/kibana/kibana.key" \
    -out "${DEVOPS_DIR}/tools/certs/kibana/kibana.csr" \
    -subj "/CN=kibana"

  openssl x509 -req \
    -in "${DEVOPS_DIR}/tools/certs/kibana/kibana.csr" \
    -CA "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt" \
    -CAkey "${DEVOPS_DIR}/tools/certs/elk-ca/ca.key" \
    -CAcreateserial \
    -out "${DEVOPS_DIR}/tools/certs/kibana/kibana.crt" \
    -days 365 \
    -sha256 \
    -extfile <(printf "subjectAltName=DNS:kibana,DNS:localhost,IP:127.0.0.1")

  rm -f "${DEVOPS_DIR}/tools/certs/kibana/kibana.csr"

  chmod 640 "${DEVOPS_DIR}/tools/certs/kibana/kibana.key"
  chmod 644 "${DEVOPS_DIR}/tools/certs/kibana/kibana.crt"
  sudo chown -R 1000:0 "${DEVOPS_DIR}/tools/certs/kibana" 2>/dev/null || true
fi

chmod 644 "${DEVOPS_DIR}/tools/certs/elk-ca/ca.crt"

echo ""
echo "Certificate generation finished"