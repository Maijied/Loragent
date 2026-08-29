#!/bin/bash
set -e
npm run build 2>/dev/null || (echo '❌ Build failed — deployment blocked' && exit 1)
echo '✅ Build verified'
