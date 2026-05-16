#!/bin/bash
set -e

KIBANA_URL="https://kibana:5601"
CA_CERT="/usr/share/kibana/config/certs/ca.crt"

echo "Waiting for Kibana..."

until curl --silent --fail \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  "$KIBANA_URL/api/status" > /dev/null; do
  sleep 5
done

echo "Importing dashboard..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X POST "$KIBANA_URL/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  --form file=@/dashboards/transcendence-dashboard.ndjson

echo ""
echo "Dashboard import completed."