#!/bin/bash
set -e

/usr/local/bin/docker-entrypoint.sh eswrapper &

ES_PID=$!

echo "Waiting for Elasticsearch..."
until curl --silent --cacert /usr/share/elasticsearch/config/certs/ca.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  https://elasticsearch:9200/_cluster/health >/dev/null; do
  sleep 3
done

echo "Setting kibana_system password..."
curl --fail --silent --show-error \
  --cacert /usr/share/elasticsearch/config/certs/ca.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X POST \
  https://elasticsearch:9200/_security/user/kibana_system/_password \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"${KIBANA_SYSTEM_PASSWORD}\"}"

echo "Elasticsearch setup finished"

/usr/local/bin/setup-ilm.sh

wait "$ES_PID"
