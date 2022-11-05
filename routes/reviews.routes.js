const express = require('express');

const validateReview = require('../middleware/validate-review');
const { isReviewAuthor } = require('../middleware/is-author');

const {
  createReview,
  deleteReview,
} = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, createReview);

router.delete('/:id', isReviewAuthor, deleteReview);

module.exports = router;
