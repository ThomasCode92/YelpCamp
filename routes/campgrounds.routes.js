const express = require('express');

const catchAsync = require('../util/catchAsync');

const validateCampground = require('../middleware/validate-campground');
const protectRoute = require('../middleware/protect-route');
const { isCampgroundAuthor } = require('../middleware/is-author');

const {
  getAllCampgrounds,
  getCampground,
  getNewCampground,
  postNewCampground,
  getEditCampground,
  editCampground,
  deleteCampground,
} = require('../controllers/campgrounds.controller');

const router = express.Router();

router
  .route('/')
  .get(catchAsync(getAllCampgrounds))
  .post(protectRoute, validateCampground, catchAsync(postNewCampground));

router.get('/new', protectRoute, getNewCampground);

router
  .route('/:id')
  .get(catchAsync(getCampground))
  .put(
    protectRoute,
    isCampgroundAuthor,
    validateCampground,
    catchAsync(editCampground)
  )
  .delete(protectRoute, isCampgroundAuthor, catchAsync(deleteCampground));

router.get(
  '/:id/edit',
  protectRoute,
  isCampgroundAuthor,
  catchAsync(getEditCampground)
);

module.exports = router;
