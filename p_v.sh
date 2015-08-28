#! /bin/bash
rm -rf target ?
rm -rf dist ?
mkdir target
gulp clean deploy --url=http://dhis2-dev.entuura.org/dev2/
