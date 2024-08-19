#!/bin/sh -x

node $@ target/index.js \
    3333 \
    /home/adamv/.secrets/recipiesapp-85118-firebase-adminsdk-3a43h-5a8b539d3a.json \
    
