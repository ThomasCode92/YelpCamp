/* eslint no-undef: "off" */

mapboxgl.accessToken = mapToken;

const campgroundData = JSON.parse(campground);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: campgroundData.geometry.coordinates,
  zoom: 9,
  projection: 'globe',
});

const marker = new mapboxgl.Marker();
const popup = new mapboxgl.Popup({ offset: 25 });

map.on('style.load', () => {
  map.setFog({});
});

popup.setHTML(`
  <h3>${campgroundData.title}</h3>
  <p>${campgroundData.location}</p>
`);

marker
  .setLngLat(campgroundData.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
