const crypto = require('crypto')

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization denied. No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const parts = token.split('.')

    if (parts.length !== 2) {
      return res.status(401).json({ success: false, message: 'Authorization denied. Invalid token format.' })
    }

    const [payloadB64, signature] = parts
    const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf8')
    const payload = JSON.parse(payloadStr)

    const secret = process.env.JWT_SECRET || 'itworks-fallback-secret'
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex')

    if (signature !== expectedSignature) {
      return res.status(401).json({ success: false, message: 'Authorization denied. Signature mismatch.' })
    }

    if (Date.now() > payload.expiresAt) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' })
    }

    req.user = payload
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(401).json({ success: false, message: 'Token verification failed. Unauthorized.' })
  }
}
