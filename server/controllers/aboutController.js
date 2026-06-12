const About = require('../models/About')

// Get the single About document, creating it with default schema values if it doesn't exist.
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({
        storyParagraphs: [],
        values: [],
        team: [],
        areas: []
      })
    }
    res.json(about)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch About page content.' })
  }
}

// Update the single About document.
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    )
    res.json(about)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update About page content: ' + err.message })
  }
}
