#!/bin/bash
export NODE_OPTIONS=--max_old_space_size=4096
# Fetch the secret and write to .env file
cd /home/ubuntu/app/alpha-portal-client-admin && aws secretsmanager get-secret-value --secret-id Alpha-Prod-client-SM --query SecretString --region eu-west-2 --output text | jq -r '. | to_entries | .[] | "\(.key)=\(.value)"' > .env
cd /home/ubuntu/app/alpha-portal-client-admin && yarn
cd /home/ubuntu/app/alpha-portal-client-admin && yarn build
