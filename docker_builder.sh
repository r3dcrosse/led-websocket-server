#!/bin/bash

usage() {
    echo "######################################################################"
    echo "ERROR: please pass a docker tag to npm run docker:build"
    echo "Example Usage:"
    echo "    npm run docker:build -- <your username>/led-websocket-server"
    echo "######################################################################"
}

main() {
    local docker_tag=$1

    if [[ ! -z $docker_tag ]]; then
        (
        docker build -t $docker_tag .;
        docker run -p 3000:3000 -d $docker_tag;
        )
    else
        usage
        exit 1
    fi
}

main "$@"
