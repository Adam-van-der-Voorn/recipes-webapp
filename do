#!/bin/sh

cd $(dirname $0)
SCRIPT_LOC=$(pwd)

CLIENT_BIN=$SCRIPT_LOC/client/node_modules/.bin
SERVER_BIN=$SCRIPT_LOC/server/node_modules/.bin

frontend_build() {
    cd $SCRIPT_LOC/client
    $CLIENT_BIN/webpack-cli --mode=production
}

frontend_test() {
    cd $SCRIPT_LOC/client
    echo "running tests with node version" $(node --version)
    node --experimental-vm-modules node_modules/jest/bin/jest.js
}

backend_run() {
    PORT=$1
    STATIC_DIR=$2
    SECRET_FIRBASE_ADMIN_PATH=$3
    node $SCRIPT_LOC/server/target/index.js $PORT $STATIC_DIR $SECRET_FIRBASE_ADMIN_PATH
}

backend_build() {
    $SERVER_BIN/tsc --project server/tsconfig.json
}

dev() {
    cd $SCRIPT_LOC/client
    $CLIENT_BIN/webpack-cli --mode=development --watch &
    cd $SCRIPT_LOC/server
    $SERVER_BIN/tsc --watch &
    node --watch $SCRIPT_LOC/server/target/index.js 3333 $SCRIPT_LOC/client/dist \
     /home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json &
}

# Check the first argument and call the appropriate function
case "$1" in
    fe:build)
        frontend_build
        ;;
    be:build)
        backend_build
        ;;
    serve)
        backend_run
        ;;
    test)
        frontend_test
        ;;
    dev)
        dev
        ;;
    *)
        echo "Usage: $0 {fe:build|be:build|serve|test|dev}"
        exit 1
        ;;
esac