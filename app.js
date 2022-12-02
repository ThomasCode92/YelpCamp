const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const createSessionConfig = require('./config/session');
const ExpressError = require('./util/ExpressError');

const checkAuthStatus = require('./middleware/check-auth');
const sessionFlash = require('./middleware/session-flash');

const User = require('./models/user.model');

const authRoutes = require('./routes/auth.routes');
const campgroundsRoutes = require('./routes/campgrounds.routes');
const reviewsRoutes = require('./routes/reviews.routes');

const app = express();
const sessionConfig = createSessionConfig();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // Serve static files (e.g. CSS files)
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.json());

app.use(expressSession(sessionConfig)); // Create the Express Session

// Passport Setup & Configuration - (Local Strategy)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method')); // Override POST requests having _method in the query string

app.use(checkAuthStatus);
app.use(sessionFlash);

app.get('/', (req, res, next) => {
  res.render('home.ejs');
});

app.use('/auth', authRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:campId/reviews', reviewsRoutes);

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
