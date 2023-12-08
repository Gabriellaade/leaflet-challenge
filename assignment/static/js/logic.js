// Leaflet map centered at a specific location
var map = L.map('map').setView([0, 0], 2);

// base tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// marker size based on earthquake magnitude
function getMarkerSize(magnitude) {
  return magnitude * 7;
}

// marker color 
function getMarkerColor(depth) {
  if (depth > 300) {
    return '#FF0000'; 
  } else if (depth > 100) {
    return '#FFA500'; 
  } else {
    return '#008000'; 
  }
}

// URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const {
        geometry: { coordinates },
        properties: { mag, depth, title }
      } = feature;


      L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getMarkerSize(mag),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<strong>${title}</strong><br>Magnitude: ${mag}<br>Depth: ${depth}`).addTo(map);
    });
  });

// legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Depth Legend</h4>';
  div.innerHTML += '<i style="background: #FFFF00"></i> Shallow (<100 km)<br>';
  div.innerHTML += '<i style="background: #FFA500"></i> Medium (100-300 km)<br>';
  div.innerHTML += '<i style="background: #FF0000"></i> Deep (>300 km)<br>';
  return div;
};

legend.addTo(map);
