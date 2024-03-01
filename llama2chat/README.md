## llama.cpp

**This repository is a fork of [llama.cpp](https://github.com/ggerganov/llama.cpp) customized to facilitate Llama2 inference within Codesphere.**

## Overview
Llama.cpp is a powerful tool for running Llama2 inference, and this fork is tailored specifically for seamless integration with Codesphere environments.

## Features

- **Pre-Configured CI Pipeline**: The CI pipeline is set up to automatically fetch a pre-converted and quantized llama code instruct model from TheBloke on Hugging Face.
- **HTTP Server Example**: The repository includes an HTTP server example, allowing for easy deployment and testing. Configuration options can be found in the /examples/server directory.
  
## Usage

1. clone this repository in a new workspace (at least Pro/GPU)
2. start the `Prepare` stage in the `CI-Pipeline`
3. after the `Prepare` stage is done you can start the `run` stage
4. click on `Open deployment` in the top right corner

## Documentation

For detailed configuration options and usage instructions, refer to the README file located in the /examples/server directory.

## Note

Please note that while this repository provides a convenient setup for running Llama2 inference in Codesphere, further customization may be required to suit specific use cases or preferences.
