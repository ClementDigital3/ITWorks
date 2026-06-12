const crypto = require('crypto')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'itworks2026'

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password' })
    }

    if (username === adminUser && password === adminPass) {
      const secret = process.env.JWT_SECRET || 'itworks-fallback-secret'
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // Token valid for 24 hours
      
      const payload = JSON.stringify({ username, expiresAt })
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
      const token = Buffer.from(payload).toString('base64') + '.' + signature

      return res.json({ success: true, token })
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' })
    }
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ success: false, message: 'Server login error' })
  }
}
