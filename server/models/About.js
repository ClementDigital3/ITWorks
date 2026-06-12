const mongoose = require('mongoose')

const valueItemSchema = new mongoose.Schema({
  num: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true }
})

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  initials: { type: String, required: true },
  color: { type: String, default: 'av-green' }
})

const aboutSchema = new mongoose.Schema({
  storyTitle: { type: String, default: 'The Team Behind the Connection' },
  storyParagraphs: [{ type: String }],
  missionTitle: { type: String, default: 'Our Mission' },
  missionStatement: { type: String },
  missionSub: { type: String },
  values: [valueItemSchema],
  team: [teamMemberSchema],
  areas: [{ type: String }],
  areaTitle: { type: String, default: 'Eldoret &\nBeyond\n<span>Kenya</span>' },
  areaText: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('About', aboutSchema)
