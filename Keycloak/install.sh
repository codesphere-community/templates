#!/bin/bash

# List of the required environment variables.
required_vars=("KEYCLOAK_ADMIN" "KEYCLOAK_ADMIN_PASSWORD" "DATABASE_URL")
missing_vars=()

# Check if an old version of Keycloak is present.
# If it is present, delete the older version.
# This is to ensure the latest updates & security patches.
if [ -f ./KEYCLOAK_VERSION ]; then
	echo [LOG] Removing Previous Version Of Keycloak!
	rm -rf keycloak-$(cat ./KEYCLOAK_VERSION)
fi

# Check whether the required environment variables are present.
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

# Display a message in case there is an environment variable missing.
if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "Please set the following environment variables before installation: ${missing_vars[*]}"
    exit 1
fi

# Set the required variables to proceed with the installation.
repo_url="https://github.com/keycloak/keycloak"
version_file="KEYCLOAK_VERSION"

# Fetch the latest version of Keycloak to include the latest updates & security patches.
latest_tag=$(curl -sSLI -o /dev/null -w '%{url_effective}' "${repo_url}/releases/latest" | awk -F/ '/tag/{print $NF}')

# Just in case the script is unable to fetch the latest version.
if [ -z "$latest_tag" ]; then
    echo "Failed to retrieve the latest release tag. Exiting."
    exit 1
fi

# Write the latest version to a separate file so that it can be started & updated in the future.
echo "$latest_tag" > "$version_file"
download_url="${repo_url}/releases/download/${latest_tag}/keycloak-${latest_tag}.tar.gz"
destination_file="keycloak-${latest_tag}.tar.gz"

# Download the Keycloak code.
echo "[LOG] Downloading Latest Version Of Keycloak: ${download_url}..."
curl -sSL -o "${destination_file}" "${download_url}" && echo "Download successful! File saved as ${destination_file}" || echo "Download failed. Please try again."

# Keycloak requires Java, the below script installs Java from NixPkgs for NixOS (https://search.nixos.org/packages?channel=23.11&show=zulu&from=0&size=50&sort=relevance&type=packages&query=java)
echo "[LOG] Installing Java via Zulu"
nix-env -iA nixpkgs.zulu

# Extract the compressed file.
echo "[LOG] Extracting Keycloak"
tar -xvf ./keycloak-${latest_tag}.tar.gz

# Delete the compressed file since it has already been uncompressed.
echo "[LOG] Deleting the tar file"
rm -rf ./keycloak-${latest_tag}.tar.gz

# Configure the database
echo "[LOG] Configuring the database"
chmod +x ./config.sh
./config.sh

# Complete Confirmation!
echo "[LOG] Installation Completed. Execute the \"RUN\" CI command."
