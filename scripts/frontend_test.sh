#!/bin/sh

set -e;

PROJECT_ROOT=$1

cd $PROJECT_ROOT/client
echo "running tests with node version" $(node --version)
node --experimental-vm-modules node_modules/jest/bin/jest.js $2 $3