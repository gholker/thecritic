#!/bin/sh

rm index.zip
zip index.zip ./* -r

## Requires aws
# 1. brew install awscli
# 2. aws configure
# -- add api/secret and us-east-1 for region
aws lambda update-function-code \
   --function-name TheCritic \
   --zip-file fileb://index.zip
