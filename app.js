const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const ExpressError = require('./util/ExpressError');

const campgroundRoutes = require('./routes/campgrounds.routes');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // Serve static files (e.g. CSS files)
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies

app.use(methodOverride('_method')); // Override POST requests having _method in the query string

app.use('/campgrounds', campgroundRoutes);

app.all('*', (req, res, next) => {
  const error = new ExpressError('Page not found!', 404);
  next(error);
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = error;

  res.status(statusCode);

  if (statusCode === 404) {
    res.render('shared/404', { message });
  } else {
    res.render('shared/500', { message });
  }
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
