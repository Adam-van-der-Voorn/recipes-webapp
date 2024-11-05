#!/bin/sh

set -e

project_root=$1
target=$project_root/target
deno_bin_name=myrecipes

# rm target if needed
# The `-d` test command option see if FILE exists and is a directory
if [ -d "$target" ]; then
    # double check that we are removing what we think we are
    n=$(find $target -maxdepth 1 -name $deno_bin_name | wc -l)
    if [ "$n" -eq 0 ]; then
        echo "deno binary ($deno_bin_name) not found in target folder ($target)"
        echo "this indicates that we my be rm-r'ing the wrong thing!"
        echo "aborting, please delete target manually before re-running"
        exit 0
    fi
    rm -r $target/*
else
    mkdir -p $target
fi

# backend_build
cd $project_root/server
deno compile --allow-read --allow-env --allow-net --output $target/$deno_bin_name src/index.ts 

# frontend_build
cd $project_root/client
node_modules/.bin/webpack-cli --mode=production
cp -r dist $target/dist

# test frontend
$project_root/scripts/frontend_test.sh $project_root 

echo "done!"


