#!/bin/bash
set -e

ES_URL="https://localhost:9200"
CA_CERT="/usr/share/elasticsearch/config/certs/ca.crt"

echo "Waiting for Elasticsearch..."

until curl --silent --fail \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  "$ES_URL/_cluster/health" > /dev/null; do
  sleep 3
done

echo "Setting fast ILM poll interval for testing..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "$ES_URL/_cluster/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "transient": {
      "indices.lifecycle.poll_interval": "10s"
    }
  }'

echo ""
echo "Creating ILM policy..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "$ES_URL/_ilm/policy/transcendence-logs-policy" \
  -H "Content-Type: application/json" \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "actions": {}
        },
        "delete": {
          "min_age": "30d",
          "actions": {
            "delete": {}
          }
        }
      }
    }
  }'

echo ""
echo "Creating index template..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "$ES_URL/_index_template/transcendence-logs-template" \
  -H "Content-Type: application/json" \
  -d '{
    "index_patterns": ["transcendence-logs-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "transcendence-logs-policy"
      }
    }
  }'

echo ""
echo "Creating snapshot repository..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "$ES_URL/_snapshot/transcendence_backup" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fs",
    "settings": {
      "location": "/snapshots"
    }
  }'

echo ""
echo "Creating SLM policy..."

curl --fail --silent --show-error \
  --cacert "$CA_CERT" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "$ES_URL/_slm/policy/transcendence-daily-snapshots" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "0 */15 * * * ?",
    "name": "<transcendence-logs-{now/d}>",
    "repository": "transcendence_backup",
    "config": {
      "indices": ["transcendence-logs-*"],
      "ignore_unavailable": true,
      "include_global_state": false
    },
    "retention": {
      "expire_after": "7d",
      "min_count": 3,
      "max_count": 14
    }
  }'

#docker compose build --no-cache elasticsearch
#docker compose up -d --force-recreate elasticsearch

# Create a test 
#curl --fail --silent --show-error \
#  --cacert "$CA_CERT" \
#  -u "elastic:${ELASTIC_PASSWORD}" \
#  -X PUT "$ES_URL/transcendence-logs-retention-test"

# Add one document
#curl --fail --silent --show-error \
#  --cacert "$CA_CERT" \
#  -u "elastic:${ELASTIC_PASSWORD}" \
#  -X POST "$ES_URL/transcendence-logs-retention-test/_doc" \
#  -H "Content-Type: application/json" \
#  -d '{
#    "@timestamp": "2026-05-16T12:00:00Z",
#    "message": "retention test"
#  }'
#"Check ILM retention:"
#"curl --cacert $CA_CERT -u elastic:\${ELASTIC_PASSWORD} $ES_URL/transcendence-logs-retention-test/_ilm/explain?pretty"
#"After ~2-3 minutes, check if the test index disappeared:"
#"curl --cacert $CA_CERT -u elastic:\${ELASTIC_PASSWORD} $ES_URL/_cat/indices?v"

#command to execute and force the snapshot: curl --cacert ./monitoring/tools/certs/elk-ca/ca.crt \
 # -u elastic:elastic_password \
 # -X POST \
 # "https://localhost:9200/_slm/policy/transcendence-daily-snapshots/_execute"
#"Check snapshot:"
#"curl --cacert $CA_CERT -u elastic:\${ELASTIC_PASSWORD} $ES_URL/_snapshot/transcendence_backup/_all?pretty"

