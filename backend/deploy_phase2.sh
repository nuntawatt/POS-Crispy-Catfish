#!/usr/bin/env bash
set -e

SOURCE_DIR="/Users/morgorn/.gemini/antigravity/brain/765579f7-9b11-455c-aad2-8c9b2fec78af/backend"
TARGET_DIR="/Users/morgorn/Desktop/project/POS-Crispy-Catfish/backend"
PSQL_BIN="/Library/PostgreSQL/18/bin/psql"

echo "=== 1. Creating Target Directories ==="
mkdir -p "${TARGET_DIR}/cmd/api"
mkdir -p "${TARGET_DIR}/internal/app"
mkdir -p "${TARGET_DIR}/internal/config"
mkdir -p "${TARGET_DIR}/internal/http/handlers"
mkdir -p "${TARGET_DIR}/internal/http/middleware"
mkdir -p "${TARGET_DIR}/internal/platform/database"
mkdir -p "${TARGET_DIR}/internal/platform/logger"
mkdir -p "${TARGET_DIR}/migrations"

echo "=== 2. Copying Go Source Files and Migrations ==="
cp -v "${SOURCE_DIR}/go.mod" "${TARGET_DIR}/go.mod"
cp -v "${SOURCE_DIR}/.env.example" "${TARGET_DIR}/.env.example"
[ -f "${TARGET_DIR}/.env" ] || cp "${SOURCE_DIR}/.env.example" "${TARGET_DIR}/.env"

cp -v "${SOURCE_DIR}/cmd/api/main.go" "${TARGET_DIR}/cmd/api/main.go"
cp -v "${SOURCE_DIR}/internal/app/app.go" "${TARGET_DIR}/internal/app/app.go"
cp -v "${SOURCE_DIR}/internal/config/config.go" "${TARGET_DIR}/internal/config/config.go"
cp -v "${SOURCE_DIR}/internal/http/router.go" "${TARGET_DIR}/internal/http/router.go"
cp -v "${SOURCE_DIR}/internal/http/handlers/health.go" "${TARGET_DIR}/internal/http/handlers/health.go"
cp -v "${SOURCE_DIR}/internal/http/middleware/cors.go" "${TARGET_DIR}/internal/http/middleware/cors.go"
cp -v "${SOURCE_DIR}/internal/http/middleware/logger.go" "${TARGET_DIR}/internal/http/middleware/logger.go"
cp -v "${SOURCE_DIR}/internal/http/middleware/recovery.go" "${TARGET_DIR}/internal/http/middleware/recovery.go"
cp -v "${SOURCE_DIR}/internal/http/middleware/requestid.go" "${TARGET_DIR}/internal/http/middleware/requestid.go"
cp -v "${SOURCE_DIR}/internal/platform/database/database.go" "${TARGET_DIR}/internal/platform/database/database.go"
cp -v "${SOURCE_DIR}/internal/platform/logger/logger.go" "${TARGET_DIR}/internal/platform/logger/logger.go"
cp -v "${SOURCE_DIR}/migrations/000001_init_schema.up.sql" "${TARGET_DIR}/migrations/000001_init_schema.up.sql"
cp -v "${SOURCE_DIR}/migrations/000001_init_schema.down.sql" "${TARGET_DIR}/migrations/000001_init_schema.down.sql"

echo "=== 3. Running go mod tidy ==="
cd "${TARGET_DIR}"
go mod tidy

echo "=== 4. Running go build ./... ==="
go build ./...

echo "=== 5. Running go vet ./... ==="
go vet ./...

echo "=== 6. Applying PostgreSQL Migration ==="
if [ -x "${PSQL_BIN}" ]; then
    PGPASSWORD=nuntawat838 "${PSQL_BIN}" -h localhost -U postgres -d crispy_catfish -f "${TARGET_DIR}/migrations/000001_init_schema.up.sql"
    echo "Database migration applied successfully."
else
    echo "Notice: ${PSQL_BIN} not found at standard path. If psql is in PATH, trying psql..."
    if command -v psql >/dev/null 2>&1; then
        PGPASSWORD=nuntawat838 psql -h localhost -U postgres -d crispy_catfish -f "${TARGET_DIR}/migrations/000001_init_schema.up.sql"
        echo "Database migration applied successfully via PATH psql."
    else
        echo "Error: psql binary not found." >&2
        exit 1
    fi
fi

echo "=== Phase 2 Foundation Successfully Deployed! ==="
