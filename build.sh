#!/bin/bash

set -euo pipefail

npx tsc

wasm-pack build --target web -- --features=console_error_panic_hook

