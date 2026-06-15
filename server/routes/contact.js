const router = require('express').Router()
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController')
const auth = require('../middleware/auth')

router.post('/', submitContact)
router.get('/', auth, getContacts)
router.patch('/:id', auth, updateContactStatus)

module.exports = router
