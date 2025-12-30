#!/bin/sh

set -e

project_root=$1
target=$project_root/target
deno_bin_name=myrecipes

# rm target if it exists and contains files
echo "-- clean --"
N=$(find "$target" -type f | wc -l)
if [ "$N" -ne 0 ]; then
    # double check that we are removing what we think we are
    n=$(find "$target" -maxdepth 1 -name $deno_bin_name | wc -l)
    if [ "$n" -eq 0 ]; then
        echo "deno binary ($deno_bin_name) not found in target folder ($target)"
        echo "this indicates that we my be rm-r'ing the wrong thing!"
        echo "aborting, please delete target manually before re-running"
        exit 0
    fi
    echo remove "$target/*"
    # disable rule to try stop rm -r /
    # shellcheck disable=SC2115
    rm -r "$target"/*
else
    mkdir -p "$target"
fi

# backend_build
echo ""
echo "-- backend build --"
cd "$project_root/server"
deno install
deno compile --allow-read --allow-env --allow-net --output "$target/$deno_bin_name" src/index.ts 
deno lint

# frontend_build
echo ""
echo "-- frontend build --"
cd "$project_root/client"
deno install
"$project_root/scripts/bundle.ts" .
cp -r dist "$target/dist"

# unit test
echo ""
echo "-- unit test --"
"$project_root/scripts/unit_test.sh" "$project_root" --silent

echo ""
echo "done!"


