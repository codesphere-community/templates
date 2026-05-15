#!/bin/bash
# For development:
uvicorn main:app --host 0.0.0.0 --port 8080 --reload

# For production:
# uvicorn main:app --host 0.0.0.0 --port 8080 --workers 4
