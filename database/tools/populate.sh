#!/bin/env bash

# This script has been created to insert in a easy way the data on our tables


# MULTIPLE INSERTS
# while read line <&3; do
#    ./populate.sh Ingredients "$line"
# done 3< ingredients.txt

#




GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DB_CONTAINER=db_postgres_1
DB_NAME=brunchio_db
DB_USER=postgres
SCHEMA=DBA_human

usage() {
	echo -e "${YELLOW}Usage:${NC} $0 <table_name> \"<INSERT statement>\""
	echo -e "${YELLOW}Example:${NC} $0 Ingredients \"('Flour', 2.50), ('Sugar', 1.75)\""
	echo -e "${YELLOW}Example with full INSERT:${NC} $0 Users \"INSERT INTO \\\"Users\\\" (name, nick, password, email) VALUES ('John', 'john123', 'pass', 'john@test.com')\""
	exit 1
}

if [ $# -lt 2 ]; then
	echo -e "${RED}Missing arguments!${NC}"
	usage
fi


# Function to run SQL command
run_sql() {
	local sql_command="$1"

	# Check if container is running - match by name, not ID
	if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
	    echo -e "${RED}Error: Container '$DB_CONTAINER' is not running${NC}"
	    echo -e "${YELLOW}Available containers:${NC}"
	    docker ps --format 'table {{.Names}}\t{{.Status}}'
	    exit 1
	fi

	# Execute SQL command
	echo -e "${YELLOW}Executing SQL in container $DB_CONTAINER...${NC}"
	docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -c "$sql_command" 2>&1

	if [ $? -eq 0 ]; then
		echo -e "${GREEN}SQL executed successfully!${NC}"
	else
		echo -e "${RED}SQL execution failed!${NC}"
		exit 1
	fi
}

# Check if minimum arguments are provided
if [ $# -lt 2 ]; then
	echo -e "${RED}Error: Missing arguments${NC}"
	usage
fi


TABLE_NAME=$1
INSERT_DATA=$2


# Construct the SQL command
# Check if the second argument is a complete INSERT statement or just VALUES
if [[ "$INSERT_DATA" =~ ^[[:space:]]*INSERT[[:space:]]+INTO ]]; then
	# It's a complete INSERT statement
	SQL_CMD="$INSERT_DATA"
else
	# It's just VALUES, construct the full INSERT
	SQL_CMD="INSERT INTO \"$SCHEMA\".\"$TABLE_NAME\" VALUES $INSERT_DATA"
fi

# Show what will be executed
echo -e "${YELLOW}Prepared SQL:${NC}"
echo "$SQL_CMD"
echo -e "${GREEN}================================${NC}"


# # Ask for confirmation
# read -p "Execute this SQL? (y/n): " -n 1 -r
# echo
# if [[ ! $REPLY =~ ^[Yy]$ ]]; then
#     echo -e "${YELLOW}Operation cancelled.${NC}"
#     exit 0
# fi

# Execute the SQL
run_sql "$SQL_CMD"
