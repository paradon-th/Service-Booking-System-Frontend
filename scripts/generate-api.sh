#!/usr/bin/env bash
set -euo pipefail

API_SPEC_URL=${API_SPEC_URL:-https://localhost:1151/swagger/v1/swagger.json}
TMP_DIR=$(mktemp -d)
TMP_SPEC="$TMP_DIR/swagger.json"
OUTPUT_DIR="lib/api/generated"
PACKAGE_NAME=${API_PACKAGE_NAME:-icubeApi}

mkdir -p "$OUTPUT_DIR"

echo "Downloading OpenAPI spec from $API_SPEC_URL"
# -k to ignore self-signed certs when hitting local HTTPS
curl -kfsSL "$API_SPEC_URL" -o "$TMP_SPEC"

bunx openapi-typescript-codegen \
  --input "$TMP_SPEC" \
  --output "$OUTPUT_DIR" \
  --client fetch \
  --name "$PACKAGE_NAME" \
  --useOptions \
  --indent 2

echo "API client generated in $OUTPUT_DIR"
rm -rf "$TMP_DIR"
