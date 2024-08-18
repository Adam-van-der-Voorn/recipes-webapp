#!/bin/sh

SCRIPT_LOC=$(dirname $0)

install_js_deps() {
    cd $SCRIPT_LOC/client
    pnpm install
}

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

# Check the first argument and call the appropriate function
case "$1" in
    install)
        install_js_deps
        ;;
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
    *)
        echo "Usage: $0 {build|build:dev|serve|test}"
        exit 1
        ;;
esac