const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  tagline:     { type: String },
  tag:         { type: String },
  description: { type: String, required: true },
  features:    [{ type: String }],
  tiers:       [{ name: String, label: String }],
  icon:        { type: String },
  order:       { type: Number, default: 0 },
  comingSoon:  { type: Boolean, default: false }
})

module.exports = mongoose.model('Service', serviceSchema)
