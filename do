#!/bin/sh

cd $(dirname $0)
SCRIPT_LOC=$(pwd)

build() {
    cd $SCRIPT_LOC/client
    node_modules/.bin/webpack-cli --mode=production
}

build_dev() {
    cd $SCRIPT_LOC/client
    node_modules/.bin/webpack-cli --mode=development --watch
}

serve() {
    cd $SCRIPT_LOC/client
    node_modules/.bin/serve -s dist
}

test() {
    cd $SCRIPT_LOC/client
    echo "running tests with node version" $(node --version)
    node --experimental-vm-modules node_modules/jest/bin/jest.js
}

ci() {
    set -e
    cd $SCRIPT_LOC/client
    echo 'npm version: '$(npm -version) '\nnode version: '$(node -v)
    pnpm install
    build
    test
}

# Check the first argument and call the appropriate function
case "$1" in
    build)
        build
        ;;
    build:dev)
        build_dev
        ;;
    serve)
        serve
        ;;
    test)
        test
        ;;
    ci)
        ci
        ;;
    *)
        echo "Usage: $0 {build|build:dev|serve|test|ci}"
        exit 1
        ;;
esac