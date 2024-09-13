#!/bin/sh

set -e

PROJECT_ROOT=$1

CLIENT_BIN=$PROJECT_ROOT/client/node_modules/.bin
SERVER_BIN=$PROJECT_ROOT/server/node_modules/.bin

frontend_build() {
    cd $PROJECT_ROOT/client
    $CLIENT_BIN/webpack-cli --mode=production
}

backend_build() {
    cd $PROJECT_ROOT
    $SERVER_BIN/tsc --project server/tsconfig.json
}

backend_build
frontend_build
$PROJECT_ROOT/scripts/frontend_test.sh $PROJECT_ROOT
# done !


