#!/bin/bash
set -e

if [[ "$1" == "runserver" ]]; then
    cd /usr/src/app
    
    npm prune --production
    npm run start:prod
fi

exec "$@"