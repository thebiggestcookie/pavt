#!/bin/bash

# Function to output file contents with a header
output_file() {
    if [ -f "$1" ]; then
        echo "===== Contents of $1 ====="
        cat "$1"
        echo ""
        echo "===== End of $1 ====="
        echo ""
    else
        echo "File $1 not found"
        echo ""
    fi
}

# List of files we're interested in
files=(
    ".gitignore"
    "package.json"
    "server.js"
    "public/index.html"
    "src/App.js"
    "src/index.js"
)

# Output directory structure (limited to depth 2)
echo "Directory structure (depth 2):"
find . -maxdepth 2 -type d | sort

echo ""
echo "Contents of specific files:"

# Output contents of specified files
for file in "${files[@]}"
do
    output_file "$file"
done

echo "End of file contents dump"
