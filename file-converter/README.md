# File Converter — Self-Hosted Template

A self-hosted file conversion tool for Codesphere workspaces. No uploads to third parties — your files stay on your server.

## Features

- **Image Conversion**: Convert between JPG, PNG, WebP, GIF, and AVIF formats
- **Batch Processing**: Convert up to 10 files at once
- **Authentication**: Token-based access control
- **Self-Hosted**: All processing happens locally on your Codesphere workspace
- **Privacy-First**: No third-party API calls, no data leaves your server

## Supported Conversions

| From | To |
|------|-----|
| PNG | JPG, WebP, AVIF |
| JPG | PNG, WebP |
| WebP | JPG, PNG |
| GIF | PNG |

## Deployment on Codesphere

1. Fork this template
2. Create a new Codesphere workspace from your fork
3. Set up the CI pipeline (auto-installed on Codesphere)
4. Run the `prepare` stage to install dependencies
5. Run the `run` stage to start the server
6. Click "Open deployment" to access the tool

## Local Development

```bash
npm install
PORT=3000 node server.js
```

Open http://localhost:3000 to use the converter.

## Authentication

All API endpoints require the `X-Auth-Token` header.

**Demo token**: `codesphere-demo-token-2024`

## API Endpoints

### GET /health
Health check endpoint.

### GET /formats
Returns supported conversion formats and pairs.

### POST /convert/image
Convert image files.

**Headers**:
- `X-Auth-Token`: Required authentication token

**Body** (multipart/form-data):
- `format`: Target format (jpg, png, webp, gif, avif)
- `files`: One or more image files

**Example**:
```bash
curl -X POST http://localhost:3000/convert/image \
  -H "X-Auth-Token: codesphere-demo-token-2024" \
  -F "format=webp" \
  -F "files=@image.png"
```

## Security Notes

- Authentication tokens are configured in `src/middleware/auth.js`
- For production, generate strong random tokens and restrict access
- File size limit: 50MB per file
- Supported MIME types: image/jpeg, image/png, image/gif, image/webp, image/avif, application/pdf

## Blog Post

[Write a blog article about this project on Dev.To, Medium, or personal blog and link it here]

---

Built for Codesphere Templates — deploy complex apps in minutes.