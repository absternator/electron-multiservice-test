#!/bin/bash

set -eu

HERE=$(dirname $0)
# Create built version of rust app in file-service
$HERE/file-service/build.sh

# move build executable in file-service/target/release to frontend/resources/linux
mkdir -p $HERE/frontend/resources/linux
cp -f $HERE/file-service/target/release/file-service $HERE/frontend/resources/linux/file-service
# Create built version of java app in backend
$HERE/backend/build.sh
# move build executable in backend/app/build/libs/fat.jar to frontend/resources/linux
cp -f $HERE/backend/app/build/libs/fat.jar $HERE/frontend/resources/linux/fat.jar

# Create built version of frontend app in frontend
$HERE/frontend/build.sh

# run 
$HERE/frontend/dist_electron/multivibe-0.0.0.AppImage
