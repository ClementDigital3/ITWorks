const router = require('express').Router()
const {
  getApprovedReviews,
  submitReview,
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin
} = require('../controllers/reviewController')
const auth = require('../middleware/auth')

// Public routes
router.get('/', getApprovedReviews)
router.post('/', submitReview)

// Admin-only routes (protected by auth middleware)
router.get('/admin', auth, getAllReviewsAdmin)
router.patch('/admin/:id', auth, updateReviewStatusAdmin)
router.delete('/admin/:id', auth, deleteReviewAdmin)

module.exports = router
