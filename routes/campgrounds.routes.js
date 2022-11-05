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

router.get('/', catchAsync(getAllCampgrounds));

router.get('/new', protectRoute, getNewCampground);

router.get('/:id', catchAsync(getCampground));

router.get(
  '/:id/edit',
  protectRoute,
  isCampgroundAuthor,
  catchAsync(getEditCampground)
);

router.post(
  '/',
  protectRoute,
  validateCampground,
  catchAsync(postNewCampground)
);

router.put(
  '/:id',
  protectRoute,
  isCampgroundAuthor,
  validateCampground,
  catchAsync(editCampground)
);

router.delete(
  '/:id',
  protectRoute,
  isCampgroundAuthor,
  catchAsync(deleteCampground)
);

module.exports = router;
