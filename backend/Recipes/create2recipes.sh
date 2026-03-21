# Create first recipe
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{"title":"Pasta","description":"Delicious pasta recipe"}' | jq .

# Create second recipe
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{"title":"Pizza","description":"Margherita with fresh basil"}' | jq .

# Get all recipes
curl http://localhost:3000/recipes | jq .