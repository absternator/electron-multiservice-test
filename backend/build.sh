#!/bin/bash

set -eu

HERE=$(dirname "$0")
cd "$HERE"
./gradlew :app:build