## llama-cpp-python FastAPI Server Template

This template installs the Python wrapper of llama.cpp from llama-cpp-python and runs a FastAPI-based Python server. The server can be utilized as a drop-in replacement for the OpenAI API. This means that code compatible with the ChatGPT API will also be compatible with this self-hosted version.

## Features

- **Compatibility**: Compatible with code designed for the OpenAI API, making it easy to transition to self-hosting.
- **Pre-Converted and Quantized Model**: Configured to fetch a pre-converted and quantized llama code instruct model from TheBloke on Hugging Face. However, you have the flexibility to use other compatible models by editing the configuration.
- **Interactive Documentation**: Upon starting the server, open the deployment URL and append /docs to access a Swagger-like API documentation. Here, you can view and test all available endpoints easily.
- **Customizable Token Settings**: By default, the max_token setting of this model is restrictive to support less capable hardware. You can adjust this setting by navigating into the installed folder /venv/lib/python3.8/site-packages/llama_cpp/server/app.py and editing line 412 in the following manner:
  
```python
max_tokens_field = Field(
    default=400, ge=1, description="The maximum number of tokens to generate."
)
```

## Usage
- **Installation**: Clone this repository and install the dependencies.
- **Configuration**: Edit the configuration to specify your desired model or settings.
- **Start the Server**: Execute the command to start the server.
- **Access Documentation**: Open the deployment URL in your browser and append /docs to access the interactive API documentation.

## Note

Please be aware that the default configuration might not suit your specific requirements. Feel free to customize the settings according to your needs.
