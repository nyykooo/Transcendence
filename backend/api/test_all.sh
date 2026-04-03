#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Recipe Fortress Battle Test ===${NC}\n"

# Step 1: Register a user
echo -e "${YELLOW}[1] Registering user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@test.com","password":"cook123","name":"Chef Warlord"}')
echo "$REGISTER_RESPONSE" | jq .
echo ""

# Step 2: Login to get token
echo -e "${YELLOW}[2] Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/login \
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
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3001/recipes \
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
VIEW_NO_TOKEN=$(curl -s http://localhost:3001/recipes)
echo "$VIEW_NO_TOKEN" | jq .
echo ""

# Step 5: View recipes with token
echo -e "${YELLOW}[5] Viewing recipes WITH token...${NC}"
VIEW_WITH_TOKEN=$(curl -s http://localhost:3001/recipes \
  -H "Authorization: Bearer $TOKEN")
echo "$VIEW_WITH_TOKEN" | jq .
echo ""

# Step 6: Register second user and test forbidden update
echo -e "${YELLOW}[6] Registering second user...${NC}"
REGISTER2_RESPONSE=$(curl -s -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"hack123","name":"Recipe Thief"}')
echo "$REGISTER2_RESPONSE" | jq .
echo ""

echo -e "${YELLOW}[6b] Logging in as second user...${NC}"
LOGIN2_RESPONSE=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@test.com","password":"hack123"}')
TOKEN2=$(echo "$LOGIN2_RESPONSE" | jq -r '.token')
echo "$LOGIN2_RESPONSE" | jq .
echo ""

if [ "$RECIPE_ID" != "null" ] && [ -n "$RECIPE_ID" ]; then
    echo -e "${YELLOW}[6c] Trying to update recipe $RECIPE_ID with second user's token (should get 403)...${NC}"
    UPDATE_FORBIDDEN=$(curl -s -X PUT "http://localhost:3001/recipes/$RECIPE_ID" \
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
    DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/recipes/$RECIPE_ID" \
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
VERIFY=$(curl -s http://localhost:3001/recipes \
  -H "Authorization: Bearer $TOKEN" | jq '.recipes | length')
echo -e "Total recipes remaining: ${GREEN}$VERIFY${NC}"
echo ""

echo -e "${YELLOW}[8] Verifying recipe is deleted...${NC}"

# 1. Login to get a token
TOKEN=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@test.com","password":"cook123"}' | jq -r '.token')

# 2. Upload the avatar
curl -X POST http://localhost:3001/profile/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test.png" | jq .

# 3. Verify the avatar is saved by checking your profile
curl -X GET http://localhost:3001/profile \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "${GREEN}=== Battle Test Complete ===${NC}"