#!/bin/bash
set -e

# Ensure you're authenticated
echo "Checking GitHub auth status..."
gh auth status

# Variables
USER="Its-Juice"
REPO="hellasnoc"
BRANCH="main"
DIR=$(pwd)

# Ensure index.html exists
if [ ! -f "index.html" ]; then
  echo "ERROR: index.html not found in $(pwd)"
  exit 1
fi

# Initialize git repo
git init
git checkout -B "$BRANCH"

# Add and commit
git add index.html
git commit -m "Initial HellasNOC landing page"

# Create or reuse GitHub repo, push
echo "Creating or connecting to GitHub repo ${USER}/${REPO}..."
gh repo create "$REPO" --public --source="." --remote=origin --push --confirm

# Enable GitHub Pages on main branch root
echo "Enabling GitHub Pages..."
gh api -X PUT /repos/"$USER"/"$REPO"/pages -f source='{"branch":"main","path":"/"}'

# Output the Pages URL
echo "Fetching Pages URL..."
gh api /repos/"$USER"/"$REPO"/pages --jq '.html_url'

