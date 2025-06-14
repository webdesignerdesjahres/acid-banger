#!/usr/bin/env bash

set -e

if [ ! -d node_modules ]; then
    npm install --no-save typescript webpack webpack-cli @types/webmidi
fi

npx tsc -p . || exit $?
mkdir -p ./dist || exit $?
npx webpack ./js/app.js --output-path ./dist/ --mode production || exit $?
cp -r index.html ui.css preview.png js/ samples/ ./dist/ || exit $?
