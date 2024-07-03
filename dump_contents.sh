#!/bin/bash

# Function to output file contents with a header
output_file() {
    echo "===== Contents of $1 ====="
    cat "$1"
    echo ""
    echo "===== End of $1 ====="
    echo ""
}

# Output directory structure
echo "Directory structure:"
find . -type d | sort

echo ""
echo "File list:"
find . -type f | sort

echo ""
echo "File contents:"

# Output contents of specific files
for file in .gitignore package.json package-lock.json public/index.html server.js src/App.js src/index.js
do
    if [ -f "$file" ]; then
        output_file "$file"
    else
        echo "File $file not found"
        echo ""
    fi
done

# Output contents of any additional .js files in the root directory
for file in *.js
do
    if [ -f "$file" ] && [ "$file" != "server.js" ]; then
        output_file "$file"
    fi
done

echo "End of file contents dump"
