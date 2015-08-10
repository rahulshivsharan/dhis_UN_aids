#! /bin/bash
rm -rf target ?
rm -rf dist ?
mkdir target
gulp clean deploy --url=http://localhost:8080
