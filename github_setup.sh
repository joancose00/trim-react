#!/bin/bash

# Replace these with your actual GitHub details
YOUR_USERNAME="joancose00"
REPO_NAME="trim-react"

# Set up the remote
git remote add origin https://github.com/$YOUR_USERNAME/$REPO_NAME.git

# Push to GitHub
git push -u origin master

echo "Successfully pushed to GitHub at https://github.com/$YOUR_USERNAME/$REPO_NAME"