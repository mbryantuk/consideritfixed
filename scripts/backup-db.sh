#!/bin/bash

# Database Backup Script for Consider IT Fixed
# Usage: ./scripts/backup-db.sh

BACKUP_DIR="./data/backups"
DB_FILE="./data/dev.db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if DB file exists
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_FILE"
    echo "Backup successful: $BACKUP_FILE"
    
    # Optional: Keep only last 30 days of backups
    find "$BACKUP_DIR" -name "backup_*.db" -type f -mtime +30 -delete
else
    echo "Error: Database file $DB_FILE not found."
    exit 1
fi
