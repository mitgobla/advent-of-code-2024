#!/bin/bash

# Check if a file name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <typescript-file>"
  exit 1
fi

# Get the filename without the extension
filename="${1%.*}"

# Run ESLint on the TypeScript file
echo "Running ESLint..."
npx eslint "$1"
if [ $? -ne 0 ]; then
  echo "ESLint found issues. Fix them before proceeding."
  exit 1
fi

# Compile the TypeScript file
echo "Compiling TypeScript..."
npx tsc "$1"
if [ $? -ne 0 ]; then
  echo "TypeScript compilation failed."
  exit 1
fi

# Run the compiled JavaScript file
echo "Running JavaScript..."
node "${filename}.js"
