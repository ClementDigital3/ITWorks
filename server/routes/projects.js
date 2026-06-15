const router = require('express').Router()
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController')
const auth = require('../middleware/auth')

const delay = (ms) => (req, res, next) => setTimeout(next, ms)

router.get('/', getProjects)
router.post('/', auth, createProject)
router.put('/:id', auth, updateProject)
router.delete('/:id', auth, deleteProject)

module.exports = router
