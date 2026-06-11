const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  installations:  { type: Number, default: 200 },
  businessClients:{ type: Number, default: 50 },
  yearsExperience:{ type: Number, default: 5 },
  citiesServed:   { type: Number, default: 15 },
  satisfaction:   { type: Number, default: 98 },
}, { timestamps: true })

module.exports = mongoose.model('Stats', statsSchema)
