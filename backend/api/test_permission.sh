set -e

TOKEN1=$(curl -s -X POST http://localhost:3001/register \
  -H 'content-type: application/json' \
  -d '{"email":"t1@x.com","password":"pass"}' | jq -r .token)

TOKEN2=$(curl -s -X POST http://localhost:3001/register \
  -H 'content-type: application/json' \
  -d '{"email":"t2@x.com","password":"pass"}' | jq -r .token)

# auth check
curl -s http://localhost:3001/auth -H "Authorization: Bearer $TOKEN1" | jq

# create recipe (owner = token1)
RID=$(curl -s -X POST http://localhost:3001/recipes \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"name":"Mine"}' | jq -r .id)

# update as owner (200) then as non-owner (403)
curl -s -X PUT http://localhost:3001/recipes/$RID \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"name":"Mine2"}' | jq

curl -s -X PUT http://localhost:3001/recipes/$RID \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"name":"Hacked"}' | jq

# delete as non-owner (403) then as owner (204)
curl -s -X DELETE http://localhost:3001/recipes/$RID -H "Authorization: Bearer $TOKEN2" | jq
curl -i -X DELETE http://localhost:3001/recipes/$RID -H "Authorization: Bearer $TOKEN1"