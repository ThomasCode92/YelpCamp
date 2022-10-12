const mongoose = require('mongoose');

const Campground = require('../models/campground.model');

const citiesData = require('./cities.json');
const descriptors = require('./descriptors.json');
const places = require('./places.json');

const getRandomElement = array =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany();

  const campgrounds = [];

  for (let i = 0; i < 20; i++) {
    const randomCityIndex = Math.floor(Math.random() * 1000);
    const randomCity = citiesData[randomCityIndex];
    const randomDescriptor = getRandomElement(descriptors);
    const randomPlace = getRandomElement(places);

    const title = `${randomDescriptor} ${randomPlace}`;
    const location = `${randomCity.city}, ${randomCity.state}`;

    const campground = new Campground({ title, location });

    campgrounds.push(campground.save());
  }

  return Promise.all(campgrounds);
};

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(async database => {
    console.log('Connected to MongoDB');
    await seedDB();
    return database.connection;
  })
  .then(connection => {
    console.log('Disconnected from MongoDB');
    connection.close();
  })
  .catch(error => {
    console.error(error);
  });
