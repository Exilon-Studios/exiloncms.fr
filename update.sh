#!/bin/bash

# ExilonCMS Update Script
# Inspired by Paymenter's update system
# This script updates ExilonCMS to the latest version

# Default URL - can be overridden with -u flag
URL='https://github.com/Exilon-Studios/ExilonCMS/releases/latest/download/exiloncms-update.tar.gz'

echo "Starting ExilonCMS upgrade process..."

# Check PHP version
if [ "$(php -r 'echo version_compare(PHP_VERSION, "8.2.0");')" -lt 0 ]; then
    echo -e "\e[31;1mCannot execute upgrade. Minimum required PHP version is 8.2, you have [$(php -r 'echo PHP_VERSION;')].\e[0m"
    exit 1
fi

# Parse arguments
PERMUSER=""
PERMGROUP=""
INSTALL=""

for i in "$@"
do
case $i in
    -u=*|--url=*)
    URL="${i#*=}"
    shift
    ;;
    -u=*|--user=*)
    PERMUSER="${i#*=}"
    shift
    ;;
    -g=*|--group=*)
    PERMGROUP="${i#*=}"
    shift
    ;;
    -i|--install)
    INSTALL=1
    shift
    ;;
    *)
            # unknown option
    ;;
esac
done

# Detect permissions
file=$(pwd)

if [ -t 0 ]; then
    # Detect webserver user
    if [ -z "$PERMUSER" ]; then
        USER2=$(stat -c '%U' "$file" 2>/dev/null || stat -f '%Su' "$file")
        read -p "Your webserver user has been detected as [$USER2]: is this correct? [Y/n]: " -r
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            read -p "Please enter the name of the user running your webserver process (usually www-data, nginx, or apache): " -r PERMUSER
        else
            PERMUSER=$USER2
        fi
    fi

    # Detect webserver group
    if [ -z "$PERMGROUP" ]; then
        GROUP2=$(stat -c '%G' "$file" 2>/dev/null || stat -f '%Sg' "$file")
        read -p "Your webserver group has been detected as [$GROUP2]: is this correct? [Y/n]: " -r
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            read -p "Please enter the name of the group running your webserver process (usually same as user): " -r PERMGROUP
        else
            PERMGROUP=$GROUP2
        fi
    fi

    if [ -z "$INSTALL" ]; then
        read -p "Are you sure you want to run the upgrade process for ExilonCMS? [y/N]: " -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Upgrade aborted."
            exit 1
        fi
    fi
fi

# Function to run commands with output
RUN() {
    echo -e "\e[34m$\e[34;1mupgrader>\e[0m $*"
    "${@}"
}

# Backup current installation
RUN php artisan backup:run --only-db

# Set application down for maintenance
RUN php artisan down

# Download the latest release
RUN curl -L -o exiloncms.tar.gz "$URL"

# Extract to temp directory first
RUN mkdir -p .exiloncms-update
RUN tar -xzf exiloncms.tar.gz -C .exiloncms-update

# Remove app folder (we'll replace it)
RUN rm -rf app

# Move new app folder
RUN mv .exiloncms-update/app ./app

# Remove update directory and tarball
RUN rm -rf .exiloncms-update
RUN rm -f exiloncms.tar.gz

# Setup correct permissions
RUN chmod -R 755 storage bootstrap/cache

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install NPM dependencies and build
RUN npm install
RUN npm run build

# Run database migrations
RUN php artisan migrate --force

# Clear and cache configs
RUN php artisan config:clear
RUN php artisan view:clear
RUN php artisan cache:clear

# Optimize for production
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Restart queues
RUN php artisan queue:restart

# Set correct ownership
RUN chown -R "$PERMUSER:$PERMGROUP" .

# Set application up
RUN php artisan up

echo -e "\e[32mUpgrade completed successfully!\e[0m"
echo "Please verify that your site is working correctly."
