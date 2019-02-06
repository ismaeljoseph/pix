#!/usr/bin/env bash

set -eu -o pipefail

# This line make the script fail if nc is not available
type nc > /dev/null

function wait_for() {
    local host="${1}"
    local port="${2}"
    echo "Waiting for: nc -z ${host} ${port}"
    for i in `seq 60`
    do
        echo -n .
        nc -z ${host} ${port} > /dev/null 2>&1 && echo && return
        sleep 1
    done
    exit 1
}

: ${1?'Missing argument (host)'}
: ${2?'Missing argument (port)'}

wait_for $1 $2
echo
