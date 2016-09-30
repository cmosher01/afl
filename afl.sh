#!/bin/sh

wg() {
  wget \
  --quiet \
  --output-document=- \
  --no-check-certificate \
  --timeout=7 \
  --tries=3 \
  --wait=3 \
  --retry-connrefused \
  --no-cache \
  "$@"
}

f=
while read lin ; do
	f="${f}${lin}%0a"
done

wg "http://mosher.mine.nu/afl?$f"
