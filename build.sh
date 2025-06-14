#!/usr/bin/env bash

if [ ! -d node_modules ]; then
    npm install @types/webmidi && npm audit fix --force
fi

npx tsc -p . || exit $?
mkdir -p ./dist || exit $?
npx webpack ./js/app.js --output-path ./dist/ --mode production || exit $?
cp -r index.html ui.css preview.png js/ samples/ ./dist/ || exit $?
