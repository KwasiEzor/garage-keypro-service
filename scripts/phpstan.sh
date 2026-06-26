#!/bin/sh
PHP_BIN="$HOME/Library/Application Support/Herd/bin/php84"
"$PHP_BIN" vendor/bin/phpstan analyse --level=8 --no-progress --no-ansi "$@"
