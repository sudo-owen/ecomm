#!/bin/bash

ids=(1 4 10 11 12 13 14 16 18 19)

for id in "${ids[@]}"; do
    curl -X PUT \
        -H "Content-Type: application/json" \
        -d '{"enabled": false}' \
        "localhost:3000/api/ab-test-configs/product/${id}"
    echo

    curl -X PUT \
        -H "Content-Type: application/json" \
        -d '{"enabled": true}' \
        "localhost:3000/api/ab-test-configs/product/${id}"
    echo
done
