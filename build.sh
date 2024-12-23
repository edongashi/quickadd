#!/bin/bash
set -euxo pipefail

export NODE_ENV=production

TARGET_DIR="$VAULT_ROOT/.obsidian/plugins/quickadd"
mkdir -p "$TARGET_DIR"

npm run build
cp main.js manifest.json styles.css "$TARGET_DIR"
