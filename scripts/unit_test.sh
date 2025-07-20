#!/bin/sh

set -e;

PROJECT_ROOT=$1

cd "$PROJECT_ROOT/server"
deno test