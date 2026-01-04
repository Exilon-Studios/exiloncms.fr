#!/bin/bash

# ExilonCMS Quick Install Script
# Usage: curl -sSL https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.sh | bash
#        or: wget -qO- https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.sh | bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

print_header() {
    echo -e "${CYAN}${BOLD}"
    echo "======================================"
    echo "   ExilonCMS Installer"
    echo "======================================"
    echo -e "${RESET}"
}

print_success() {
    echo -e "${GREEN}✅ $1${RESET}"
}

print_error() {
    echo -e "${RED}❌ $1${RESET}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${RESET}"
}

print_header

# Get project name
PROJECT_NAME=${1:-exiloncms}

if [ "$PROJECT_NAME" = "--help" ] || [ "$PROJECT_NAME" = "-h" ]; then
    echo "Usage: curl -sSL https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.sh | bash -s -- <project-name>"
    echo ""
    echo "Examples:"
    echo "  curl -sSL https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.sh | bash"
    echo "  curl -sSL https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.sh | bash -s -- my-site"
    exit 0
fi

print_info "Project name: $PROJECT_NAME"

# Check if directory exists
if [ -d "$PROJECT_NAME" ]; then
    print_error "Directory '$PROJECT_NAME' already exists!"
    exit 1
fi

# Check PHP
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 8.2 or higher."
    echo ""
    echo "Ubuntu/Debian: sudo apt install php8.2 php8.2-xml php8.2-zip php8.2-mbstring"
    echo "macOS: brew install php"
    echo "Windows: https://windows.php.net/download/"
    exit 1
fi

PHP_VERSION=$(php -r 'echo PHP_VERSION;' | cut -d'.' -f1,2)
print_success "PHP $PHP_VERSION found"

# Check minimum version
MIN_VERSION="8.2"
if [ "$(printf '%s\n' "$MIN_VERSION" "$PHP_VERSION" | sort -V | head -n1)" != "$MIN_VERSION" ]; then
    print_error "PHP $MIN_VERSION or higher is required (you have $PHP_VERSION)"
    exit 1
fi

# Check Composer
if ! command -v composer &> /dev/null; then
    print_error "Composer is not installed. Please install Composer first."
    echo "https://getcomposer.org/download/"
    exit 1
fi

print_success "Composer found"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    echo "https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
print_success "Node.js v$NODE_VERSION found"

# Download CLI
print_info "Downloading ExilonCMS CLI..."

CLI_URL="https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/bin/exiloncms"

if command -v curl &> /dev/null; then
    curl -sSL "$CLI_URL" -o exiloncms
elif command -v wget &> /dev/null; then
    wget -q "$CLI_URL" -O exiloncms
else
    print_error "Neither curl nor wget is installed."
    exit 1
fi

if [ ! -f "exiloncms" ]; then
    print_error "Failed to download CLI."
    exit 1
fi

chmod +x exiloncms
print_success "CLI downloaded"

# Run installer
print_info "Starting installation..."
echo ""

php exiloncms "$PROJECT_NAME"

# Cleanup
rm -f exiloncms

exit $?
