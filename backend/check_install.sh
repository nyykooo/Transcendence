#!/bin/env bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    if [ "$2" = "success" ]; then
        echo -e "${GREEN}✓${NC} $1"
    elif [ "$2" = "error" ]; then
        echo -e "${RED}✗${NC} $1"
    elif [ "$2" = "warning" ]; then
        echo -e "${YELLOW}⚠${NC} $1"
    else
        echo "$1"
    fi
}

echo "Checking required dependencies..."

# Track if any installation is needed
needs_install=false
packages_to_install=()

# Check curl
if command_exists curl; then
    print_status "curl is already installed" "success"
else
    print_status "curl is missing, will install" "warning"
    packages_to_install+=("curl")
    needs_install=true
fi

# Check npm
if command_exists npm; then
    print_status "npm is already installed" "success"
else
    print_status "npm is missing, will install" "warning"
    packages_to_install+=("npm")
    needs_install=true
fi

# Install missing packages if any
if [ "$needs_install" = true ]; then
    echo ""
    echo "Installing missing packages: ${packages_to_install[*]}"
    
    # Update package list
    echo "Updating package list..."
    sudo apt update
    
    if [ $? -ne 0 ]; then
        print_status "Failed to update package list" "error"
        exit 1
    fi
    
    # Install packages
    echo "Installing packages..."
    sudo apt install -y "${packages_to_install[@]}"
    
    if [ $? -eq 0 ]; then
        print_status "All packages installed successfully" "success"
    else
        print_status "Failed to install packages" "error"
        exit 1
    fi
else
    echo ""
    print_status "All dependencies are already installed" "success"
fi

# Verify installations and show versions
echo ""
echo "Verifying installations:"

if command_exists curl; then
    curl_version=$(curl --version | head -n1 | cut -d' ' -f2)
    print_status "curl version: $curl_version" "success"
else
    print_status "curl verification failed" "error"
    exit 1
fi

if command_exists npm; then
    npm_version=$(npm --version)
    print_status "npm version: $npm_version" "success"
else
    print_status "npm verification failed" "error"
    exit 1
fi

echo ""
print_status "Dependency check completed successfully" "success"