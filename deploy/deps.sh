#!/usr/bin/env bash
cd /srv/www/node/go-code-remote

#Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm



npm install
npm run compile
npm run build
cd client
#No .env file in client w
NODE_ENV=production npm install
NODE_ENV=production npm run tailwind
NODE_ENV=production npm run compile
cd ..
