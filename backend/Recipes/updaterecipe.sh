# Get recipe with id 1
curl http://localhost:3000/recipes/1 | jq .

# Try to get non-existent recipe
curl http://localhost:3000/recipes/999 | jq .

# Update recipe 1
curl -X PUT http://localhost:3000/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Gourmet Pasta","description":"With fresh herbs and garlic"}' | jq .

# Verify the update
curl http://localhost:3000/recipes/1 | jq .

# Delete recipe 2
curl -X DELETE http://localhost:3000/recipes/2 | jq .

# Verify deletion
curl http://localhost:3000/recipes | jq .