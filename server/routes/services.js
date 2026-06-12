const express = require('express')
const router = express.Router()
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController')
const auth = require('../middleware/auth')

router.get('/', getServices)
router.get('/:slug', getService)
router.post('/', auth, createService)
router.put('/:id', auth, updateService)
router.delete('/:id', auth, deleteService)

module.exports = router
