const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  category:   { type: String, enum: ['wifi','networks','hotspot','cctv','cabling','support'], required: true },
  location:   { type: String, required: true },
  tag:        { type: String },
  description:{ type: String },
  tags:       [String],
  featured:   { type: Boolean, default: false },
  large:      { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now }
})

module.exports = mongoose.model('Project', projectSchema)
