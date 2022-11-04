const mongoose = require('mongoose');

const User = require('../models/user.model');
const Campground = require('../models/campground.model');

const citiesData = require('./cities.json');
const descriptors = require('./descriptors.json');
const places = require('./places.json');

const getRandomElement = array =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await User.deleteMany();
  await Campground.deleteMany();

  const user = new User({ username: 'John Doe', email: 'john.doe@gmail.com' });
  const registeredUser = await User.register(user, 'johndoe');

  const campgrounds = [];

  for (let i = 0; i < 20; i++) {
    const randomCityIndex = Math.floor(Math.random() * 1000);
    const randomCity = citiesData[randomCityIndex];
    const randomDescriptor = getRandomElement(descriptors);
    const randomPlace = getRandomElement(places);
    const randomPrice = Math.floor(Math.random() * 20) + 10;

    const title = `${randomDescriptor} ${randomPlace}`;
    const image = 'https://source.unsplash.com/collection/483251';
    const location = `${randomCity.city}, ${randomCity.state}`;
    const description =
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, molestias labore. Nulla, facere adipisci corporis dignissimos veniam quidem ipsa quasi nemo!';

    const campground = new Campground({
      title,
      image,
      price: randomPrice,
      location,
      description,
      author: registeredUser._id,
    });

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
