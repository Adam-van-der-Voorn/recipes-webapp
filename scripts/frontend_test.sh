#!/bin/sh

set -e;

PROJECT_ROOT=$1

cd "$PROJECT_ROOT/client"
node_args="--experimental-vm-modules node_modules/jest/bin/jest.js $2 $3"
echo "node version: $(node --version)"
echo "run: node $node_args"
# shellcheck disable=SC2086
node $node_args