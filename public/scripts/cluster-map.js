/* For more info, visit https://docs.mapbox.com/mapbox-gl-js/example/cluster/ */
/* eslint no-undef: "off" */

mapboxgl.accessToken = mapToken;

const campgroundData = { features: JSON.parse(campgrounds) };
const numberOfCampgrounds = campgroundData.features.length;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-103.5917, 40.6699],
  zoom: 3,
  projection: 'mercator',
});

map.on('load', () => {
  map.addSource('campgrounds', {
    type: 'geojson',
    data: campgroundData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        numberOfCampgrounds / 10,
        '#f1f075',
        numberOfCampgrounds / 5,
        '#f28cb1',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        numberOfCampgrounds / 10,
        25,
        numberOfCampgrounds / 5,
        30,
      ],
    },
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });

  map.on('click', 'clusters', event => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['clusters'],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource('campgrounds')
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
  });

  map.on('click', 'unclustered-point', event => {
    const coordinates = event.features[0].geometry.coordinates.slice();
    const tsunami = event.features[0].properties.tsunami === 1 ? 'yes' : 'no';
    const { mag } = event.features[0].properties;

    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
      .addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
});
