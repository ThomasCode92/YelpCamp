const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const { cloudinary } = require('../config/cloudinary');
const { flashDataToSession } = require('../util/session-flash');

const Campground = require('../models/campground.model');

const geocoder = mapboxGeocoding({ accessToken: process.env.MAPBOX_API_KEY });

async function getAllCampgrounds(req, res, next) {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}

async function getCampground(req, res) {
  const campgroundId = req.params.id;
  const campground = await Campground.findById(campgroundId)
    .populate('author')
    .populate({ path: 'reviews', populate: { path: 'author' } });

  if (campground) {
    res.render('campgrounds/campground-details', { campground });
  } else {
    const flashData = {
      status: 'error',
      message: 'Cannot find requested campground!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect(`/campgrounds`);
    });
  }
}

function getNewCampground(req, res) {
  res.render('campgrounds/new-campground');
}

async function postNewCampground(req, res) {
  const { title, location, price, description } = req.body.campground;
  const { files } = req;
  const userId = req.user._id;

  const geoData = await geocoder
    .forwardGeocode({ query: location, limit: 1 })
    .send();

  const images = files.map(file => ({
    url: file.path,
    filename: file.filename,
  }));

  const campgroundData = { title, location, price, description };
  const campground = new Campground(campgroundData);

  campground.geometry = geoData.body.features[0].geometry;
  campground.author = userId;
  campground.images = images;
  await campground.save();

  const flashData = {
    status: 'success',
    message: 'Successfully created a new campground!',
  };

  flashDataToSession(req, flashData, () => {
    res.redirect(`/campgrounds/${campground._id}`);
  });
}

async function getEditCampground(req, res) {
  const campgroundId = req.params.id;
  const campground = await Campground.findById(campgroundId);

  if (!campground) {
    const flashData = {
      status: 'error',
      message: 'Cannot find requested campground!',
    };

    flashDataToSession(req, flashData, () => {
      res.redirect(`/campgrounds`);
    });
  } else {
    res.render('campgrounds/update-campground', { campground });
  }
}

async function editCampground(req, res, next) {
  const campgroundId = req.params.id;
  const { title, location, price, description } = req.body.campground;
  const { deleteImages } = req.body;
  const { files } = req;

  const geoData = await geocoder
    .forwardGeocode({ query: location, limit: 1 })
    .send();

  const images = files.map(file => ({
    url: file.path,
    filename: file.filename,
  }));

  const campgroundData = { title, location, price, description };
  campgroundData.geometry = geoData.body.features[0].geometry;

  const campground = await Campground.findByIdAndUpdate(
    campgroundId,
    campgroundData
  );

  campground.images.push(...images);
  await campground.save();

  if (deleteImages) {
    const cloudinaryDestroyCalls = [];

    deleteImages.forEach(filename => {
      cloudinaryDestroyCalls.push(cloudinary.uploader.destroy(filename));
    });

    await Promise.all(cloudinaryDestroyCalls);

    await campground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }

  const flashData = {
    status: 'success',
    message: 'Successfully updated this campground!',
  };

  flashDataToSession(req, flashData, () => {
    res.redirect(`/campgrounds/${campgroundId}`);
  });
}

async function deleteCampground(req, res) {
  const campgroundId = req.params.id;

  await Campground.findByIdAndDelete(campgroundId);

  const flashData = {
    status: 'success',
    message: 'Successfully deleted a campground!',
  };

  flashDataToSession(req, flashData, () => {
    res.redirect('/campgrounds');
  });
}

module.exports = {
  getAllCampgrounds,
  getCampground,
  getNewCampground,
  postNewCampground,
  getEditCampground,
  editCampground,
  deleteCampground,
};
