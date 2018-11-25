#!/bin/bash

CURR_COMMIT=$(git rev-parse HEAD);
CURR_VERSION=$(node -e "console.log(require('./package.json').version);");
VER_HASH=$(git rev-list -n 1 v$CURR_VERSION);

if [ $CURR_COMMIT == $VER_HASH ]
then
    echo 'Already up to date'
    exit
fi

npm run lint;

if [[$? -ne 0]] ; then
    exit 1
fi

npm run test -- --watch=false;

if [[$? -ne 0]] ; then
    exit 1
fi

npm run build;

if [[$? -ne 0]] ; then
    exit 1
fi

echo version...;
npm version patch;

NEW_VERSION=$(node -e "console.log(require('./package.json').version);");

git push origin head;

echo push to aws...;
aws s3 sync ./dist/fpl s3://fpl.mattdsmith.co.uk/ --delete;

echo invalidate cache...;
aws cloudfront create-invalidation --distribution-id E2ZUN114INJGO7 --paths "/*";

echo done publish v$NEW_VERSION.;
