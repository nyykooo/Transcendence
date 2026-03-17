GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DB_CONTAINER=transcendence_db
DB_NAME=TranscendenceDB
DB_USER=postgres
SCHEMA=DBA_human


run_sql ()
{
	docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < "$1"
}

usage() {
	echo "${YELLOW}Usage:${NC} $0 <insertion_file>.sql "
	exit 1
}

if [ $# -lt 1 ]; then
	echo "${RED}ERROR: no argument provided${NC}"
	usage
fi

run_sql "$1"
