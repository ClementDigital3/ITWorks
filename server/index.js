const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const path = require('path')

dotenv.config()

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`)
  next()
})

// Rate limit contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
})

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/contact', contactLimiter, require('./routes/contact'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/services', require('./routes/services'))
app.use('/api/stats', require('./routes/stats'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/about', require('./routes/about'))
app.use('/api/reviews', require('./routes/reviews'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }))

// Serve static assets in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

// ── Server & MongoDB ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`))

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/itworks')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err.message)
    console.log('⚠ Server running in offline fallback mode')
  })
// Trigger restart
