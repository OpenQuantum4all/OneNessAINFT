#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Create production build directory if it doesn't exist
mkdir -p .next

# Copy necessary files to build directory
echo "Copying files..."
cp -r public .next/
cp package.json .next/
cp render.yaml .next/
cp README.md .next/

echo "Build complete! The contents of the .next directory are ready for deployment."
