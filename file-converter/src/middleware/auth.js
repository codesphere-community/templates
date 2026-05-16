const authTokens = new Set([
  'codesphere-demo-token-2024',
  'demo-access-xyz789',
  'test-user-abc123',
])

function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token']
  if (!token || !authTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized. Provide valid X-Auth-Token header.' })
  }
  next()
}

module.exports = { authMiddleware, authTokens }