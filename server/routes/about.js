const express = require('express')
const { getAbout, updateAbout } = require('../controllers/aboutController')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', getAbout)
router.put('/', auth, updateAbout)

module.exports = router
