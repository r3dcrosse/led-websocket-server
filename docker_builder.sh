#!/bin/bash

usage() {
    echo "######################################################################"
    echo "ERROR: please pass a docker tag to npm run docker:build"
    echo "Example Usage:"
    echo " npm run docker:build -- [<your username>/led-websocket-server] [port]"
    echo "######################################################################"
}

main() {
    local docker_tag=$1
    local port="${$1:-3000}"

    if [[ ! -z $docker_tag ]]; then
        (
        docker build -t $docker_tag .;
        docker run -p $port:3000 -d $docker_tag;
        )
    else
        usage
        exit 1
    fi
}

main "$@"
