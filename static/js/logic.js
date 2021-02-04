// API
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

var myMap = L.map("mapid", {
    center: [40.7608, -111.8910],
    zoom: 5,
    });


var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY,
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY,
}).addTo(myMap);

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
});

var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
});

var baseMaps = {
  "Dark Map": darkmap,
  "Light Map": lightmap,
  "Satellite Map": satellitemap,
  "Outdoor Map": outdoorsmap
};

function findRadius(magnitude) {
    return magnitude * 4;
}

function findColor(d) {
    return d > 90 ? '#ff0000' :
            d > 70  ? "#ff6600":
            d > 50  ? "#ff9900" :
            d > 30  ? "#ffcc00" :
            d > 10   ? "#ffff00" :
            d > -10   ? "#00cc00" :
                        "990033";
    }

d3.json(url2).then(function(data) {
  var myStyle = {
    "color": "#0099cc",
    "weight": 2,
    "opacity": 0.65
  };
  var plateLayer = L.geoJson(data, {
    style: myStyle
  });
  var overlayMaps = {
    "Tectonic Plates": plateLayer 
  }
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});

d3.json(url).then(function(data) {   
  console.log(data);
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            radius: findRadius(feature.properties.mag),
            color: 'black',
            fillColor: findColor(feature.geometry.coordinates[2]),
            stroke: false,
            fillOpacity: 0.5
          });
        },
        
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + `Location: ${feature.properties.place}`+ "</h3><h3>" + `Magnitude: ${feature.properties.mag}` + "</h3><h3>" + `Depth: ${feature.geometry.coordinates[2]}` + "</h3>");
            layer.on({
              mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.9
                });
              },
              mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
              },
            });
          }
      
      }).addTo(myMap);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += ('<strong>Earthquake Depth</strong><br>')
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + findColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
