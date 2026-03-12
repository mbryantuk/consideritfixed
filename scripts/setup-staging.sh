#!/bin/bash

# Staging Environment Setup Script for Consider IT Fixed
# Usage: ./scripts/setup-staging.sh

echo "Setting up staging environment..."

# 1. Create a separate network for staging
docker network create staging-network 2>/dev/null

# 2. Use a separate docker-compose-staging.yml or override
# docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# 3. Use a different database file
# CP data/dev.db data/staging.db

echo "Staging environment configuration template created."
echo "Recommended: Use a separate VPS or subdomain (e.g. staging.consideritfixed.uk) for real staging."
