const Service = require('../models/Service')

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 })
    res.json({ success: true, data: services })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.getService = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, data: service })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({ success: true, data: service })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, data: service })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
