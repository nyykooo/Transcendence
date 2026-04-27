#!/bin/env bash


set -e


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="${SCRIPT_DIR}"
SQL_RUNNER="${TOOLS_DIR}/sql_run.sh"
SQL_DIR="${TOOLS_DIR}/SQL/"


echo ""
echo "Starting database setup..."
echo ""



echo ""
echo "Creating database..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}DB_creation.sql"


echo ""
echo "Creating tables..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}Create_tables.sql"


echo ""
echo "Creating monitoring user..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}Create_monitoring_user.sql"


echo ""
echo "Importing recipes..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}imported_recipes.sql"


echo ""
echo "Importing ingredients..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}Ingredients_import.sql"


echo ""
echo "Running recipe import script..."
echo ""
"${TOOLS_DIR}/sql_import_recipes.sh"


echo ""
echo "Creating procedures..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}Procedure.sql"


echo ""
echo "Fixing prices..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}FixPrices.sql"


echo ""
echo "Creating triggers..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}Triggers.sql"


echo ""
echo "Creating admin user..."
echo ""
"${TOOLS_DIR}/create_admin.sh"


echo ""
echo "Updating diets..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}UpdateDiets.sql"


echo ""
echo "Creating table constraints..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}ConstraintsPostCreation.sql"


echo ""
echo "Updating urls..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}AddUrls.sql"


echo ""
echo "Fixing sequences..."
echo ""
"${SQL_RUNNER}" "${SQL_DIR}FixSequences.sql"


echo ""
echo "Database setup completed successfully!"
echo ""