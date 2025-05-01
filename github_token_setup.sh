#!/bin/bash

# GitHub details
GITHUB_USERNAME="joancose00"
REPO_NAME="trim-react"

echo "Setting up GitHub repository with token authentication"
echo "======================================================="
echo ""
echo "1. First, create a Personal Access Token on GitHub:"
echo "   - Go to: https://github.com/settings/tokens"
echo "   - Click 'Generate new token'"
echo "   - Select 'repo' permissions"
echo "   - Generate and copy the token"
echo ""
echo "2. Set up remote with your token:"
echo "   git remote set-url origin https://$GITHUB_USERNAME:YOUR_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "3. Or push directly using:"
echo "   git push -u origin master"
echo ""
echo "Remember to replace YOUR_TOKEN with your actual token"