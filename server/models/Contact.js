const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  email:      { type: String, trim: true, lowercase: true },
  service:    { type: String, required: true },
  location:   { type: String, required: true, trim: true },
  size:       { type: String },
  message:    { type: String, trim: true },
  status:     { type: String, enum: ['new','contacted','converted','closed'], default: 'new' },
  createdAt:  { type: Date, default: Date.now }
})

module.exports = mongoose.model('Contact', contactSchema)
