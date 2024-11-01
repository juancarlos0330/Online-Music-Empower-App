#!/bin/bash

set -e

export NODE_ENV=production

pm2 start yarn --interpreter bash --name empower_hour -- production:start