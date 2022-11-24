/* eslint no-undef: "off" */

mapboxgl.accessToken = mapToken;

const { coordinates } = JSON.parse(geometry);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coordinates,
  zoom: 9,
  projection: 'globe',
});

const marker = new mapboxgl.Marker();

map.on('style.load', () => {
  map.setFog({});
});

marker.setLngLat(coordinates).addTo(map);
