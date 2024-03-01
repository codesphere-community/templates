#!/bin/bash

# Check for required environment variables
required_vars=("KEYCLOAK_ADMIN" "KEYCLOAK_ADMIN_PASSWORD" "DATABASE_URL")
missing_vars=()

if [ -f ./KEYCLOAK_VERSION ]; then
	echo [LOG] Removing Previous Version Of Keycloak!
	rm -rf keycloak-$(cat ./KEYCLOAK_VERSION)
fi

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "Please set the following environment variables before installation: ${missing_vars[*]}"
    exit 1
fi

# Proceed with installation
repo_url="https://github.com/keycloak/keycloak"
version_file="KEYCLOAK_VERSION"
latest_tag=$(curl -sSLI -o /dev/null -w '%{url_effective}' "${repo_url}/releases/latest" | awk -F/ '/tag/{print $NF}')

if [ -z "$latest_tag" ]; then
    echo "Failed to retrieve the latest release tag. Exiting."
    exit 1
fi

echo "$latest_tag" > "$version_file"
download_url="${repo_url}/releases/download/${latest_tag}/keycloak-${latest_tag}.tar.gz"
destination_file="keycloak-${latest_tag}.tar.gz"

echo "[LOG] Downloading Latest Version Of Keycloak: ${download_url}..."
curl -sSL -o "${destination_file}" "${download_url}" && echo "Download successful! File saved as ${destination_file}" || echo "Download failed. Please try again."

echo "[LOG] Installing Java via Zulu"
nix-env -iA nixpkgs.zulu

echo "[LOG] Extracting Keycloak"
tar -xvf ./keycloak-${latest_tag}.tar.gz

echo "[LOG] Deleting the tar file"
rm -rf ./keycloak-${latest_tag}.tar.gz

echo "[LOG] Installation Completed. Execute the \"RUN\" CI command."
