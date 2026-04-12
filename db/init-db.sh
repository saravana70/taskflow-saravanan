#!/bin/bash
set -e

# TaskFlow — Database Initialization Script
# Orchestrates schema migrations and seed data on container startup

echo ">>> Applying database migrations..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/migrations/000001_init.up.sql

echo ">>> Applying initial seed data..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/seed.sql

echo ">>> Database initialization complete."
