const Review = require('../models/Review')

// Public - Fetch only approved reviews
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' })
  }
}

// Public - Submit a review (defaults to pending)
exports.submitReview = async (req, res) => {
  try {
    const { name, initials, role, text, rating } = req.body

    if (!name || !role || !text) {
      return res.status(400).json({ error: 'Please fill in all required fields.' })
    }

    const review = await Review.create({
      name,
      initials,
      role,
      text,
      rating: rating ? parseInt(rating) : 5,
      status: 'pending'
    })

    res.status(201).json({ success: true, id: review._id })
  } catch (err) {
    console.error('Review submit error:', err)
    res.status(500).json({ error: 'Failed to submit review.' })
  }
}

// Admin only - Fetch all reviews (pending & approved)
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all reviews.' })
  }
}

// Admin only - Approve review or toggle status
exports.updateReviewStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' })
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!review) return res.status(404).json({ error: 'Review not found.' })
    res.json(review)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review status.' })
  }
}

// Admin only - Delete review
exports.deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ error: 'Review not found.' })
    res.json({ success: true, message: 'Review deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review.' })
  }
}
