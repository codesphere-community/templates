#!/bin/bash

# Get the database url from the environment variable
url=$DATABASE_URL

# Remove the not required content
url=$(echo "$url" | sed 's/?sslmode=require//')

# Extracting components from the database URL
# This is done because Keycloak isn't allowing using the full database URL directly
username=$(echo "$url" | awk -F '://' '{split($2,a,"@"); print a[1]}' | awk -F ':' '{print $1}')
password=$(echo "$url" | awk -F '://' '{split($2,a,"@"); print a[1]}' | awk -F ':' '{print $2}')
host=$(echo "$url" | awk -F '://' '{split($2,a,"@"); print a[2]}' | awk -F '?' '{print $1}')
host_port_path=$(echo "$url" | awk -F '://' '{split($2,a,"@"); print a[2]}' | awk -F '?' '{print $1}')
IFS='/' read -r host_port path <<< "$host_port_path"
IFS=':' read -r host port <<< "$host_port"

# Constructing the JDBC URL
db_url="jdbc:postgresql://$host:$port/$path"

# Remove the previous configuration
rm -rf ./keycloak-$(cat ./KEYCLOAK_VERSION)/conf/keycloak.conf

# Writing a new, updated configuration
echo "db=postgres" > ./keycloak-$(cat ./KEYCLOAK_VERSION)/conf/keycloak.conf
echo "db-username=$username" >> ./keycloak-$(cat ./KEYCLOAK_VERSION)/conf/keycloak.conf
echo "db-password=$password" >> ./keycloak-$(cat ./KEYCLOAK_VERSION)/conf/keycloak.conf
echo "db-url=$db_url" >> ./keycloak-$(cat ./KEYCLOAK_VERSION)/conf/keycloak.conf
