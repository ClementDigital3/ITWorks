const express = require('express')
const router = express.Router()
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController')

router.get('/', getServices)
router.get('/:slug', getService)
router.post('/', createService)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

module.exports = router
