#!/bin/bash

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Examples:
#   BASE_URL=https://localhost/api ./test_all.sh
#   BASE_URL=https://localhost:3443 ./test_all.sh
BASE_URL="${BASE_URL:-https://localhost:3443}"

# For local self-signed certs over HTTPS, curl will use -k by default.
# Set STRICT_TLS=1 to enforce certificate validation.
STRICT_TLS="${STRICT_TLS:-0}"

CURL_BASE=(-sS)
if [[ "$BASE_URL" == https://* ]] && [[ "$STRICT_TLS" != "1" ]]; then
    CURL_BASE+=(-k)
fi

api_curl() {
    curl "${CURL_BASE[@]}" "$@"
}

request_with_code() {
    local response body code
    response=$(api_curl "$@" -w "\n%{http_code}")
    code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    echo "$body"
    echo "$code"
}

print_json_or_raw() {
    local body="$1"
    if echo "$body" | jq . >/dev/null 2>&1; then
        echo "$body" | jq .
    else
        echo "$body"
    fi
}

assert_code() {
    local got="$1"
    local want="$2"
    local label="$3"
    if [[ "$got" == "$want" ]]; then
        echo -e "${GREEN}[PASS] ${label} (HTTP ${got})${NC}"
    else
        echo -e "${RED}[FAIL] ${label} (expected ${want}, got ${got})${NC}"
    fi
}

step() {
  local label="$1"
  echo -e "${YELLOW}${label}${NC}"
}

echo -e "${YELLOW}=== API Curl Battle Test ===${NC}\n"
echo -e "${YELLOW}Using API base URL: ${BASE_URL}${NC}"
if [[ "$BASE_URL" == https://* ]] && [[ "$STRICT_TLS" != "1" ]]; then
    echo -e "${YELLOW}TLS mode: insecure (-k) for local/self-signed certificates${NC}\n"
else
    echo -e "${YELLOW}TLS mode: strict certificate verification${NC}\n"
fi

    if [[ "$STRICT_TLS" == "1" ]]; then
      echo -e "${YELLOW}[0] Strict TLS smoke check...${NC}"
      set +e
      STRICT_OUTPUT=$(curl -sS "$BASE_URL/" 2>&1)
      STRICT_CODE=$?
      set -e
      if [[ "$STRICT_CODE" -ne 0 ]]; then
        echo -e "${GREEN}[PASS] Strict TLS is enforced (curl exited ${STRICT_CODE})${NC}"
      else
        echo -e "${RED}[FAIL] Strict TLS smoke check did not fail as expected${NC}"
        echo "$STRICT_OUTPUT"
      fi
      echo ""
    fi

RUN_ID="$(date +%s)"
EMAIL1="chef.${RUN_ID}@test.com"
EMAIL2="hacker.${RUN_ID}@test.com"
PASS1="cook123"
PASS2="hack123"
RECIPE_NAME="Tropical Curd Pancake ${RUN_ID}"

step "[1] TLS + root route check (expected 404 on /)..."
mapfile -t TLS_ROOT < <(request_with_code "$BASE_URL/")
assert_code "${TLS_ROOT[-1]}" "404" "Root route returns 404"
echo ""

step "[2] Register user #1..."
mapfile -t REG1 < <(request_with_code -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL1}\",\"password\":\"${PASS1}\",\"name\":\"Chef Warlord ${RUN_ID}\"}")
print_json_or_raw "${REG1[0]}"
assert_code "${REG1[-1]}" "200" "Register user #1"
TOKEN1=$(echo "${REG1[0]}" | jq -r '.token // empty')
if [[ -z "$TOKEN1" ]]; then
    echo -e "${RED}Token for user #1 missing. Exiting.${NC}"
    exit 1
fi
echo ""

step "[2b] Register without password (expected 400)..."
mapfile -t REG_BAD < <(request_with_code -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"broken.${RUN_ID}@test.com\"}")
print_json_or_raw "${REG_BAD[0]}"
assert_code "${REG_BAD[-1]}" "400" "Register missing password"
echo ""

step "[3] Login with wrong password (expected 401)..."
mapfile -t BAD_LOGIN < <(request_with_code -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL1}\",\"password\":\"wrong\"}")
print_json_or_raw "${BAD_LOGIN[0]}"
assert_code "${BAD_LOGIN[-1]}" "401" "Login wrong password"
echo ""

step "[3b] Login without password (expected 400)..."
mapfile -t LOGIN_BAD < <(request_with_code -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL1}\"}")
print_json_or_raw "${LOGIN_BAD[0]}"
assert_code "${LOGIN_BAD[-1]}" "400" "Login missing password"
echo ""

step "[4] Login user #1 and get token..."
mapfile -t LOGIN1 < <(request_with_code -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL1}\",\"password\":\"${PASS1}\"}")
print_json_or_raw "${LOGIN1[0]}"
assert_code "${LOGIN1[-1]}" "200" "Login user #1"
TOKEN1=$(echo "${LOGIN1[0]}" | jq -r '.token // empty')
if [[ -z "$TOKEN1" ]]; then
    echo -e "${RED}Token for user #1 missing after login. Exiting.${NC}"
    exit 1
fi
echo ""

step "[5] Protected route without token (expected 401)..."
mapfile -t AUTH_NO_TOKEN < <(request_with_code "$BASE_URL/auth")
print_json_or_raw "${AUTH_NO_TOKEN[0]}"
assert_code "${AUTH_NO_TOKEN[-1]}" "401" "Auth without token"
echo ""

step "[6] Protected route with invalid token (expected 401)..."
mapfile -t AUTH_BAD_TOKEN < <(request_with_code "$BASE_URL/auth" \
  -H "Authorization: Bearer invalid.token.value")
print_json_or_raw "${AUTH_BAD_TOKEN[0]}"
assert_code "${AUTH_BAD_TOKEN[-1]}" "401" "Auth with invalid token"
echo ""

step "[7] Protected route with valid token..."
mapfile -t AUTH_OK < <(request_with_code "$BASE_URL/auth" \
  -H "Authorization: Bearer $TOKEN1")
print_json_or_raw "${AUTH_OK[0]}"
assert_code "${AUTH_OK[-1]}" "200" "Auth with valid token"
echo ""

step "[8] Create recipe with token..."
mapfile -t CREATE < <(request_with_code -X POST "${BASE_URL}/pending/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{\"name\":\"${RECIPE_NAME}\",\"ingredients\":[{\"name\":\"Kiwi\",\"unit\":\"g\",\"quantity\":22},{\"name\":\"Pineapple\",\"unit\":\"g\",\"quantity\":56}]}")
print_json_or_raw "${CREATE[0]}"
assert_code "${CREATE[-1]}" "201" "Create recipe"
RECIPE_NAME_CREATED=$(echo "${CREATE[0]}" | jq -r '.name // empty')
if [[ -z "$RECIPE_NAME_CREATED" ]]; then
    echo -e "${RED}Recipe name missing. Exiting.${NC}"
    exit 1
fi
RECIPE_NAME_ENC=$(jq -nr --arg name "$RECIPE_NAME_CREATED" '$name|@uri')
echo ""

step "[8b] Create recipe without token (expected 401)..."
mapfile -t CREATE_NO_TOKEN < <(request_with_code -X POST "${BASE_URL}/pending/recipes" \
  -H "Content-Type: application/json" \
  -d '{"name":"No Token Recipe"}')
print_json_or_raw "${CREATE_NO_TOKEN[0]}"
assert_code "${CREATE_NO_TOKEN[-1]}" "401" "Create without token"
echo ""

step "[8c] Create recipe missing name (expected 400)..."
mapfile -t CREATE_BAD < <(request_with_code -X POST "${BASE_URL}/pending/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"instructions":"Only instructions"}')
print_json_or_raw "${CREATE_BAD[0]}"
assert_code "${CREATE_BAD[-1]}" "400" "Create missing name"
echo ""

step "[9] List recipes with valid token..."
mapfile -t LIST_OK < <(request_with_code "$BASE_URL/pending/recipes" \
  -H "Authorization: Bearer $TOKEN1")
print_json_or_raw "${LIST_OK[0]}"
assert_code "${LIST_OK[-1]}" "200" "List recipes"
echo ""

step "[10] Invalid JSON payload (expected 400)..."
mapfile -t BAD_JSON < <(request_with_code -X POST "${BASE_URL}/pending/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"name":')
print_json_or_raw "${BAD_JSON[0]}"
assert_code "${BAD_JSON[-1]}" "400" "Malformed JSON rejected"
echo ""

step "[11] Register + login user #2..."
mapfile -t REG2 < <(request_with_code -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL2}\",\"password\":\"${PASS2}\",\"name\":\"Recipe Thief ${RUN_ID}\"}")
assert_code "${REG2[-1]}" "200" "Register user #2"
mapfile -t LOGIN2 < <(request_with_code -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL2}\",\"password\":\"${PASS2}\"}")
print_json_or_raw "${LOGIN2[0]}"
assert_code "${LOGIN2[-1]}" "200" "Login user #2"
TOKEN2=$(echo "${LOGIN2[0]}" | jq -r '.token // empty')
if [[ -z "$TOKEN2" ]]; then
    echo -e "${RED}Token for user #2 missing. Exiting.${NC}"
    exit 1
fi
echo ""

step "[12] Forbidden update with user #2 (expected 403)..."
mapfile -t FORBIDDEN_UPDATE < <(request_with_code -X PUT "${BASE_URL}/pending/recipes/$RECIPE_NAME_ENC" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"name":"Hacked Recipe"}')
print_json_or_raw "${FORBIDDEN_UPDATE[0]}"
assert_code "${FORBIDDEN_UPDATE[-1]}" "403" "Forbidden update"
echo ""

step "[13] Unsupported method + invalid route..."
mapfile -t BAD_METHOD < <(request_with_code -X PATCH "${BASE_URL}/pending/recipes" \
  -H "Authorization: Bearer $TOKEN1")
print_json_or_raw "${BAD_METHOD[0]}"
assert_code "${BAD_METHOD[-1]}" "404" "Unsupported PATCH route"

mapfile -t BAD_ROUTE < <(request_with_code "${BASE_URL}/does-not-exist")
print_json_or_raw "${BAD_ROUTE[0]}"
assert_code "${BAD_ROUTE[-1]}" "404" "Invalid route"
echo ""

step "[14] Optional avatar upload test..."
AVATAR_FIXTURE="../../../frontend/public/assets/image/icons/brunchio_logo.png"
if [[ -f "$AVATAR_FIXTURE" ]]; then
    mapfile -t AVATAR_UPLOAD < <(request_with_code -X POST "${BASE_URL}/profile/avatar" \
      -H "Authorization: Bearer $TOKEN1" \
      -F "avatar=@${AVATAR_FIXTURE}")
    print_json_or_raw "${AVATAR_UPLOAD[0]}"
    assert_code "${AVATAR_UPLOAD[-1]}" "200" "Avatar upload"
else
    echo -e "${YELLOW}Skipping avatar upload: ${AVATAR_FIXTURE} not found${NC}"
fi
echo ""

echo -e "${GREEN}=== API Curl Battle Test Complete ===${NC}"