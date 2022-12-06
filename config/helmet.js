const scriptSrcUrls = [
  'https://api.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://kit.fontawesome.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
];

const styleSrcUrls = [
  'https://kit-free.fontawesome.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
  'https://fonts.googleapis.com',
  'https://use.fontawesome.com',
  'https://cdn.jsdelivr.net',
];

const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://events.mapbox.com',
];

const imageSrcUrls = [
  `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
  'https://images.unsplash.com',
];

const fontSrcUrls = [];

const contentSecurityPolicy = {
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", 'blob:'],
    childSrc: ['blob:'],
    objectSrc: [],
    imgSrc: ["'self'", 'blob:', 'data:', ...imageSrcUrls],
    fontSrc: ["'self'", ...fontSrcUrls],
  },
};

module.exports = { contentSecurityPolicy };
