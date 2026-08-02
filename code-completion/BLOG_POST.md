# Building a private code-completion workspace on Codesphere

An autocomplete UI does not need to send source code to a hosted SaaS API. This
template keeps the browser interface small and places an OpenAI-compatible model
behind a private internal URL. A Codesphere workspace can therefore host the UI
and the model service together, while the operator controls the model file,
configuration, and retention policy.

The application has three deliberate boundaries: the browser sends only the
current editor text to the application, the application sends a structured prompt
to the configured local model, and the response is returned without persisting
either prompt or completion. `MODEL_API_KEY` is read from the environment and is
never placed in the page or logged. This makes the template a useful starting
point for teams that need an interactive code assistant without committing to an
external inference provider.

To try it, start any OpenAI-compatible local model server, run `python3 app.py`,
and open the exposed deployment. The test suite uses a fake response, so the HTTP
boundary can be verified before a model is downloaded or configured. The same
shape also makes it straightforward to substitute a different self-hosted model
server later.
