#!/bin/sh

cd $(dirname $0)
SCRIPT_LOC=$(pwd)

CLIENT_BIN=$SCRIPT_LOC/client/node_modules/.bin
SERVER_BIN=$SCRIPT_LOC/server/node_modules/.bin

frontend_build() {
    cd $SCRIPT_LOC/client
    $CLIENT_BIN/webpack-cli --mode=production
}

frontend_build_dev() {
    cd $SCRIPT_LOC/client
    $CLIENT_BIN/webpack-cli --mode=development --watch
}

frontend_serve() {
    cd $SCRIPT_LOC/client
    $CLIENT_BIN/serve -s dist
}

frontend_test() {
    cd $SCRIPT_LOC/client
    echo "running tests with node version" $(node --version)
    node --experimental-vm-modules node_modules/jest/bin/jest.js
}

backend_run() {
    PORT=$1
    SECRET_FIRBASE_ADMIN_PATH=$2
    node $SCRIPT_LOC/server/target/index.js $PORT $SECRET_FIRBASE_ADMIN_PATH
}

backend_run_dev() {
    node --watch $SCRIPT_LOC/server/target/index.js 3333 /home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json
}

backend_build() {
    $SERVER_BIN/tsc --project server/tsconfig.json
}

backend_build_dev() {
    $SERVER_BIN/tsc --project server/tsconfig.json --watch
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
    be:build)
        backend_build
        ;;
    be:build:dev)
        backend_build_dev
        ;;
    be:run)
        backend_run
        ;;
    be:run:dev)
        backend_run_dev
        ;;
    fe:build)
        frontend_build
        ;;
    fe:build:dev)
        frontend_build_dev
        ;;
    fe:serve)
        frontend_serve
        ;;
    fe:test)
        frontend_test
        ;;
    ci)
        ci
        ;;
    *)
        echo "Usage: $0 fe:{build|build:dev|serve|test|ci}"
        exit 1
        ;;
esac