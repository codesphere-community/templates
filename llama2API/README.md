This template will install the python wrapper of llama.cpp from [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) and run a FastAPI based python server that can be used as a drop in replacement for the openAI API. This means code that is compatible with the chatGPT API will also be compatible with this self hosted version.

 The CI pipeline is configured to fetch a pre-converted and quantized llama code instruct model from TheBloke from [huggingface](https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF) but you can edit that to use other compatible models too.

 Once the server is started open the deployment url and append /docs to see a swagger like API documentation where you can view and test all available endpoints. 

 Per default the max_token setting of this model is very restrictive (to support less capable hardware) - if you want to send or receive longer queries navigate into the installed folder /.venv/lib/python3.8/site-packages/llama_cpp/server/app.py and edit line 412:

 ```python
 max_tokens_field = Field(
    default=400, ge=1, description="The maximum number of tokens to generate."
)
``` 