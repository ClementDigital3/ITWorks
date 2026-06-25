const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  initials:  { type: String, trim: true },
  role:      { type: String, required: true, trim: true }, // e.g. "Homeowner, Eldoret" or "Business Client"
  text:      { type: String, required: true, trim: true },
  rating:    { type: Number, required: true, min: 1, max: 5, default: 5 },
  status:    { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

// Auto-generate initials before saving if not provided
reviewSchema.pre('save', function(next) {
  if (!this.initials && this.name) {
    const parts = this.name.trim().split(/\s+/)
    if (parts.length >= 2) {
      this.initials = (parts[0][0] + parts[1][0]).toUpperCase()
    } else if (parts[0]) {
      this.initials = parts[0].substring(0, 2).toUpperCase()
    }
  }
  next()
})

module.exports = mongoose.model('Review', reviewSchema)
