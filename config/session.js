const expressSession = require('express-session');

const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION,
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in ms
    },
  };
}

module.exports = createSessionConfig;
