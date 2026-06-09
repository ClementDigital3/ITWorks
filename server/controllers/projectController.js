const Project = require('../models/Project')

exports.getProjects = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects.' })
  }
}

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ error: 'Project not found.' })
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found.' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' })
  }
}
