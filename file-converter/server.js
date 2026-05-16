const express = require('express')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { authMiddleware } = require('./src/middleware/auth')
const { convertImage } = require('./src/utils/imageConverter')

const app = express()
const PORT = process.env.PORT || 3000

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
      'application/pdf',
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`))
    }
  },
})

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'file-converter', timestamp: new Date().toISOString() })
})

app.get('/formats', (req, res) => {
  res.json({
    image: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    supportedPairs: [
      { from: 'png', to: 'jpg', description: 'PNG to JPG conversion' },
      { from: 'jpg', to: 'png', description: 'JPG to PNG conversion' },
      { from: 'jpg', to: 'webp', description: 'JPG to WebP conversion' },
      { from: 'png', to: 'webp', description: 'PNG to WebP conversion' },
      { from: 'gif', to: 'png', description: 'GIF to PNG conversion' },
      { from: 'webp', to: 'jpg', description: 'WebP to JPG conversion' },
    ],
  })
})

app.post('/convert/image', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    const { format } = req.body
    if (!format) {
      return res.status(400).json({ error: 'Missing target format in request body' })
    }

    const targetFormat = format.toLowerCase().replace('.', '')
    const results = []

    for (const file of req.files) {
      try {
        const converted = await convertImage(file.buffer, targetFormat)
        const outputName = `${path.parse(file.originalname).name}.${targetFormat}`
        results.push({
          originalName: file.originalname,
          convertedName: outputName,
          targetFormat,
          success: true,
          size: converted.length,
          data: converted.toString('base64'),
        })
      } catch (err) {
        results.push({
          originalName: file.originalname,
          targetFormat,
          success: false,
          error: err.message,
        })
      }
    }

    res.json({ results, successful: results.filter(r => r.success).length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Converter — Self-Hosted</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #c9d1d9; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    header { text-align: center; margin-bottom: 40px; }
    h1 { font-size: 32px; margin-bottom: 8px; }
    .subtitle { color: #8b949e; font-size: 14px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; margin-bottom: 24px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; }
    select, input[type="text"] { width: 100%; padding: 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 8px; color: #c9d1d9; font-size: 16px; }
    .drop-zone { border: 2px dashed #30363d; border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
    .drop-zone:hover, .drop-zone.dragover { border-color: #58a6ff; background: rgba(88,166,255,0.1); }
    .drop-zone input { display: none; }
    .drop-zone p { color: #8b949e; }
    .file-list { margin-top: 16px; }
    .file-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #0d1117; border-radius: 8px; margin-bottom: 8px; }
    .file-item span { font-size: 14px; }
    .btn { display: inline-block; padding: 14px 28px; background: #238636; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; }
    .btn:hover { background: #2ea043; }
    .btn:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }
    .auth-section { margin-bottom: 24px; padding: 16px; background: #0d1117; border-radius: 8px; border: 1px solid #30363d; }
    .auth-section input { margin-bottom: 8px; }
    .result { margin-top: 24px; }
    .success { color: #3fb950; }
    .formats { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
    .format-tag { padding: 4px 12px; background: #21262d; border-radius: 16px; font-size: 12px; color: #8b949e; }
    .api-note { margin-top: 32px; padding: 16px; background: #161b22; border-radius: 8px; border: 1px solid #30363d; }
    .api-note code { background: #0d1117; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>File Converter</h1>
      <p class="subtitle">Self-hosted • No uploads to third parties • Full privacy</p>
    </header>

    <div class="auth-section">
      <label for="token">Auth Token (required)</label>
      <input type="text" id="token" placeholder="Enter auth token" value="codesphere-demo-token-2024">
      <small style="color: #8b949e;">Use: codesphere-demo-token-2024</small>
    </div>

    <div class="card">
      <div class="form-group">
        <label for="format">Convert to:</label>
        <select id="format">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WebP</option>
          <option value="avif">AVIF</option>
          <option value="gif">GIF</option>
        </select>
      </div>

      <div class="drop-zone" id="dropZone">
        <input type="file" id="fileInput" multiple accept="image/*">
        <p>Drop images here or click to select<br><small>JPG, PNG, WebP, GIF, AVIF supported</small></p>
      </div>

      <div class="file-list" id="fileList"></div>

      <button class="btn" id="convertBtn" disabled>Convert Files</button>
    </div>

    <div class="result" id="result" style="display:none;"></div>

    <div class="api-note">
      <strong>API Usage:</strong><br><br>
      <code>POST /convert/image</code> — Send files with <code>X-Auth-Token</code> header<br><br>
      <code>GET /formats</code> — View supported conversion formats<br><br>
      <code>GET /health</code> — Health check endpoint
    </div>
  </div>

  <script>
    const dropZone = document.getElementById('dropZone')
    const fileInput = document.getElementById('fileInput')
    const fileList = document.getElementById('fileList')
    const convertBtn = document.getElementById('convertBtn')
    const resultDiv = document.getElementById('result')
    const tokenInput = document.getElementById('token')
    let selectedFiles = []

    dropZone.addEventListener('click', () => fileInput.click())
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover') })
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'))
    dropZone.addEventListener('drop', e => {
      e.preventDefault()
      dropZone.classList.remove('dragover')
      handleFiles(e.dataTransfer.files)
    })
    fileInput.addEventListener('change', e => handleFiles(e.target.files))

    function handleFiles(files) {
      selectedFiles = [...files]
      fileList.innerHTML = selectedFiles.map(f => \`
        <div class="file-item">
          <span>\${f.name} (\${(f.size/1024).toFixed(1)} KB)</span>
          <span>\${f.type}</span>
        </div>
      \`).join('')
      convertBtn.disabled = selectedFiles.length === 0
    }

    convertBtn.addEventListener('click', async () => {
      const token = tokenInput.value
      const format = document.getElementById('format').value
      const formData = new FormData()
      formData.append('format', format)
      selectedFiles.forEach(f => formData.append('files', f))

      try {
        convertBtn.textContent = 'Converting...'
        convertBtn.disabled = true
        const res = await fetch('/convert/image', {
          method: 'POST',
          headers: { 'X-Auth-Token': token },
          body: formData
        })
        const data = await res.json()

        if (data.results) {
          const successes = data.results.filter(r => r.success).length
          resultDiv.style.display = 'block'
          resultDiv.innerHTML = \`
            <div class="card">
              <h3 class="success">Converted \${successes}/\${data.results.length} files</h3>
              \${data.results.map(r => r.success
                ? \`<p>\${r.originalName} → \${r.convertedName} (\${r.size} bytes)</p>\`
                : \`<p style="color:#f85149">\${r.originalName}: \${r.error}</p>\`
              ).join('')}
            </div>
          \`
        }
      } catch (err) {
        resultDiv.style.display = 'block'
        resultDiv.innerHTML = \`<p style="color:#f85149">Error: \${err.message}</p>\`
      }
      convertBtn.textContent = 'Convert Files'
      convertBtn.disabled = selectedFiles.length === 0
    })
  </script>
</body>
</html>
  `)
})

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`File Converter running on port ${PORT}`)
})