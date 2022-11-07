const multer = require('multer');

const { storage } = require('../config/cloudinary');

const upload = multer({ storage });
const uploadImage = upload.array('images');

module.exports = uploadImage;
