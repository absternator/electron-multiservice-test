#!/bin/bash
set -eu

HERE=$(cd "$(dirname "$0")" && pwd)
PLATFORM="$(uname | tr '[:upper:]' '[:lower:]')"

# Build Rust file service
"$HERE/file-service/build.sh"

# Copy Rust binary to frontend/resources/$PLATFORM
mkdir -p "$HERE/frontend/resources/$PLATFORM"
cp -f "$HERE/file-service/target/release/file-service" "$HERE/frontend/resources/$PLATFORM/file-service"

# Build Kotlin backend
"$HERE/backend/build.sh"
# Copy fat.jar to frontend/resources/$PLATFORM
cp -f "$HERE/backend/app/build/libs/fat.jar" "$HERE/frontend/resources/$PLATFORM/fat.jar"

# Build electron app
cd "$HERE/frontend"
npm install
npm run electron:build
cd "$HERE"

