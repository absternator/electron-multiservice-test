#!/bin/bash

set -eu

HERE=$(dirname $0)
cargo build --release --manifest-path $HERE/Cargo.toml