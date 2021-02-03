
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var myMap = L.map("mapid", {
    center: [40.7608, -111.8910],
    zoom: 5,
    });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
    }).addTo(myMap);

function findRadius(magnitude) {
    return magnitude * 2.5;
}

d3.json(url).then(function(data) {
    console.log(data);
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            radius: findRadius(feature.properties.mag),
            color: 'black',
            fillColor: "green",
            stroke: false,
            fillOpacity: 0.75
          });
        },
      }).addTo(myMap);
});
