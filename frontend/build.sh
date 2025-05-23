#!/bin/bash

set -eu

HERE=$(dirname $0)

npm --prefix $HERE install
npm --prefix $HERE run electron:build