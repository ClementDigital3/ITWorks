const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Service = require('./models/Service')
const Project = require('./models/Project')

dotenv.config()

async function cleanDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/itworks'
    console.log(`Connecting to database at ${MONGO_URI}...`)
    
    await mongoose.connect(MONGO_URI)
    console.log('✓ Connected to MongoDB.')

    console.log('Clearing all services and projects...')
    const serviceRes = await Service.deleteMany({})
    const projectRes = await Project.deleteMany({})
    
    console.log(`✓ Successfully deleted:`)
    console.log(`   - ${serviceRes.deletedCount} services`)
    console.log(`   - ${projectRes.deletedCount} projects`)

    process.exit(0)
  } catch (err) {
    console.error('✗ Cleanup failed:', err.message)
    process.exit(1)
  }
}

cleanDatabase()
