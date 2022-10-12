const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const Campground = require('./models/campground.model');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log('Connected to MongoDB'))
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch(error => {
    console.log(error);
  });
