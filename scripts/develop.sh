#!/bin/sh

project_root=$1


############################
## frontend watch & build ##
############################

"$project_root/scripts/relog.ts" "$project_root" "bundle: " ./scripts/bundle.ts ./client dev watch &
 
################################/
## backend build, watch, & run ##
################################/

address=$(hostname -I |  tr ' ' '\n' | grep 192.168 || echo "127.0.0.1")


"$project_root/scripts/relog.ts" "$project_root" "server: " deno \
 --allow-read --allow-env --allow-net --watch server/src/index.ts \
 --port 3333 \
 --static-dir client/dist \
 --fb-secrets-file /home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json \
 --server "$address"