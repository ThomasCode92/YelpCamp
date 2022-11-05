const express = require('express');
const multer = require('multer');

const { storage } = require('../config/cloudinary');

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
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(getAllCampgrounds))
  // .post(protectRoute, validateCampground, catchAsync(postNewCampground));
  .post(upload.array('image'), (req, res, next) => {
    console.log(req.files);
    res.send('Images uploaded...');
  });

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
