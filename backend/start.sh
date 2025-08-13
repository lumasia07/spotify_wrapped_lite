#!/bin/bash

# Create database directory if it doesn't exist
mkdir -p /var/www/html/database

# Create SQLite database file if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
    chmod 664 /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Run migrations
php artisan migrate --force

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Start the server
php artisan serve --host=0.0.0.0 --port=$PORT
