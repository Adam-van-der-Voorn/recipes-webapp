#!/bin/sh

cd "$(dirname "$0")" || exit
PROJECT_ROOT=$(pwd)

case "$1" in
    dev)
        deno --allow-all "$PROJECT_ROOT/scripts/develop.ts" "$PROJECT_ROOT"
        ;;
    production_build)
        "$PROJECT_ROOT/scripts/prod_build.sh" "$PROJECT_ROOT"
        ;;
    test)
        "$PROJECT_ROOT/scripts/unit_test.sh" "$PROJECT_ROOT" "$2" "$3"
        ;;
    *)
        echo "Usage: $0 {dev|production_build|test}"
        exit 1
        ;;
esac