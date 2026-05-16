#!/usr/bin/env bash
set -euo pipefail

FLUTTER_DIR="$PWD/.flutter"
export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$PWD/.config}"
mkdir -p "$XDG_CONFIG_HOME"

if command -v flutter >/dev/null 2>&1; then
  flutter config --enable-web
  flutter --version
  exit 0
fi

if [ ! -x "$FLUTTER_DIR/bin/flutter" ]; then
  git clone --depth 1 --branch stable https://github.com/flutter/flutter.git "$FLUTTER_DIR"
fi

export PATH="$FLUTTER_DIR/bin:$PATH"
flutter config --enable-web
flutter --version
