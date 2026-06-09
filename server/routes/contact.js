const router = require('express').Router()
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController')

router.post('/', submitContact)
router.get('/', getContacts)
router.patch('/:id', updateContactStatus)

module.exports = router
