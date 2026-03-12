#!/bin/bash

# Simple Uptime Monitor for Consider IT Fixed
# Usage: ./scripts/monitor-uptime.sh https://consideritfixed.uk

URL=$1
if [ -z "$URL" ]; then
    URL="http://localhost:3000"
fi

HEALTH_URL="$URL/api/health"
LOG_FILE="./data/uptime.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")

if [ "$RESPONSE" -eq 200 ]; then
    echo "[$TIMESTAMP] OK: $RESPONSE" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ERROR: $RESPONSE" >> "$LOG_FILE"
    # Here you could send an alert via email/SMS
    # Example: mail -s "SITE DOWN: $URL" admin@example.com <<< "Site returned $RESPONSE at $TIMESTAMP"
fi

# Keep only last 1000 lines of log
tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
