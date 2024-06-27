## How to activate public beta Landscape Deployments on Codesphere 

1. Create a placeholder file e.g. `ci.txt`
2. Copy following code snippet into that file:
   
```yaml
  schemaVersion: v0.2
  prepare:
    steps: []
  test:
    steps: []
  run: {}
``` 
3. Rename `ci.txt` to `ci.yml`

Now you can access the new CI-Pipeline layout and create your own Landscape Deployments.

## What to consider when deploying a landscape?

1. Every service should be exposed to host `0.0.0.0` and port `3000`
2. For now every service needs to expose their URL-path accordingly to the corresponding prefix path of the CI-Pipeline configuration.
