/* eslint no-undef: "off" */

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.5, 40],
  zoom: 9,
  projection: 'globe',
});

map.on('style.load', () => {
  map.setFog({});
});
