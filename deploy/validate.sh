#!/usr/bin/env bash
cd /srv/www/node/go-code-remote
sleep 20
nc -zv 127.0.0.1 3000
