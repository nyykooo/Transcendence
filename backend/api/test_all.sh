#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# HTTPS-ready API endpoint.
# Examples:
#   BASE_URL=https://localhost/api ./test_all.sh
#   BASE_URL=https://localhost:3443 ./test_all.sh
BASE_URL="${BASE_URL:-https://localhost/api}"

# For local self-signed certs over HTTPS, curl will use -k by default.
# Set STRICT_TLS=1 to enforce certificate validation.
STRICT_TLS="${STRICT_TLS:-0}"

CURL_BASE=(-s)
if [[ "$BASE_URL" == https://* ]] && [[ "$STRICT_TLS" != "1" ]]; then
    CURL_BASE+=(-k)
fi

api_curl() {
    curl "${CURL_BASE[@]}" "$@"
}

echo -e "${YELLOW}=== Recipe Fortress Battle Test ===${NC}\n"
echo -e "${YELLOW}Using API base URL: ${BASE_URL}${NC}"
if [[ "$BASE_URL" == https://* ]] && [[ "$STRICT_TLS" != "1" ]]; then
    echo -e "${YELLOW}TLS mode: insecure (-k) for local/self-signed certificates${NC}\n"
else
    echo -e "${YELLOW}TLS mode: strict certificate verification${NC}\n"
fi

# Step 1: Register a user
echo -e "${YELLOW}[1] Registering user...${NC}"
REGISTER_RESPONSE=$(api_curl -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@test.com","password":"cook123","name":"Chef Warlord"}')
echo "$REGISTER_RESPONSE" | jq .
echo ""

# Step 2: Login to get token
echo -e "${YELLOW}[2] Logging in...${NC}"
LOGIN_RESPONSE=$(api_curl -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@test.com","password":"cook123"}')
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "$LOGIN_RESPONSE" | jq .
echo ""

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}Failed to get token. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}Token obtained: $TOKEN${NC}\n"

# Step 3: Create a recipe with token
echo -e "${YELLOW}[3] Creating recipe...${NC}"
CREATE_RESPONSE=$(api_curl -X POST "${BASE_URL}/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Pasta Carbonara","instructions":"Eggs, cheese, guanciale, pepper"}')
echo "$CREATE_RESPONSE" | jq .
RECIPE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
echo ""

if [ "$RECIPE_ID" != "null" ] && [ -n "$RECIPE_ID" ]; then
    echo -e "${GREEN}Recipe created with ID: $RECIPE_ID${NC}\n"
else
    echo -e "${RED}Failed to create recipe. Recipe ID not found.${NC}\n"
fi

# Step 4: Try to view recipes without token (should fail)
echo -e "${YELLOW}[4] Viewing recipes WITHOUT token (should fail)...${NC}"
VIEW_NO_TOKEN=$(api_curl "${BASE_URL}/recipes")
echo "$VIEW_NO_TOKEN" | jq .
echo ""

# Step 5: View recipes with token
echo -e "${YELLOW}[5] Viewing recipes WITH token...${NC}"
VIEW_WITH_TOKEN=$(api_curl "${BASE_URL}/recipes" \
  -H "Authorization: Bearer $TOKEN")
echo "$VIEW_WITH_TOKEN" | jq .
echo ""

# Step 6: Register second user and test forbidden update
echo -e "${YELLOW}[6] Registering second user...${NC}"
REGISTER2_RESPONSE=$(api_curl -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"hack123","name":"Recipe Thief"}')
echo "$REGISTER2_RESPONSE" | jq .
echo ""

echo -e "${YELLOW}[6b] Logging in as second user...${NC}"
LOGIN2_RESPONSE=$(api_curl -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"hack123"}')
TOKEN2=$(echo "$LOGIN2_RESPONSE" | jq -r '.token')
echo "$LOGIN2_RESPONSE" | jq .
echo ""

if [ "$RECIPE_ID" != "null" ] && [ -n "$RECIPE_ID" ]; then
    echo -e "${YELLOW}[6c] Trying to update recipe $RECIPE_ID with second user's token (should get 403)...${NC}"
  UPDATE_FORBIDDEN=$(api_curl -X PUT "${BASE_URL}/recipes/$RECIPE_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN2" \
      -d '{"name":"Hacked Recipe","instructions":"Stolen!"}')
    echo "$UPDATE_FORBIDDEN" | jq .
    echo ""
else
    echo -e "${RED}Skipping forbidden update test - no recipe ID available${NC}\n"
fi

# Step 7: Delete the recipe
if [ "$RECIPE_ID" != "null" ] && [ -n "$RECIPE_ID" ]; then
    echo -e "${YELLOW}[7] Deleting recipe $RECIPE_ID...${NC}"
    DELETE_RESPONSE=$(api_curl -X DELETE "${BASE_URL}/recipes/$RECIPE_ID" \
      -H "Authorization: Bearer $TOKEN" -w "\n%{http_code}")
    HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
    BODY=$(echo "$DELETE_RESPONSE" | sed '$d')
    if [ "$HTTP_CODE" == "204" ]; then
        echo -e "${GREEN}Delete successful (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}Delete failed with HTTP $HTTP_CODE${NC}"
        echo "$BODY" | jq .
    fi
    echo ""
else
    echo -e "${RED}Skipping delete test - no recipe ID available${NC}\n"
fi

# Step 8: Verify recipe is deleted
echo -e "${YELLOW}[8] Verifying recipe is deleted...${NC}"
VERIFY=$(api_curl "${BASE_URL}/recipes" \
  -H "Authorization: Bearer $TOKEN" | jq '.recipes | length')
echo -e "Total recipes remaining: ${GREEN}$VERIFY${NC}"
echo ""

echo -e "${YELLOW}[8] Verifying recipe is deleted...${NC}"

# 1. Login to get a token
TOKEN=$(api_curl -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@test.com","password":"cook123"}' | jq -r '.token')

# 2. Upload the avatar
api_curl -X POST "${BASE_URL}/profile/avatar" \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test.png" | jq .

# 3. Verify the avatar is saved by checking your profile
api_curl -X GET "${BASE_URL}/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "${GREEN}=== Battle Test Complete ===${NC}"