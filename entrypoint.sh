#!/bin/bash
set -e

# Install the package in editable mode (development)
# This is idempotent and ensures code changes are picked up
if [ -f /app/pyproject.toml ]; then
  pip install -e . --quiet
fi

# Initialize/migrate the database
# cd /app/orc_api
orc db migrate
# cd /app

# Start the application within Dockerfile
exec "$@"
