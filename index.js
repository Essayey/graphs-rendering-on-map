var map;
let paths;
let nodes;
let sources;
let destinations;

fetch('./Layers/Paths.geojson')
    .then(response => response.json())
    .then(json => paths = json);

fetch('./Layers/Nodes.geojson')
    .then(response => response.json())
    .then(json => nodes = json);

fetch('./Layers/Sources.geojson')
    .then(response => response.json())
    .then(json => sources = json);

fetch('./Layers/Destinations.geojson')
    .then(response => response.json())
    .then(json => destinations = json);


DG.then(function () {
    map = DG.map('map', {
        center: [54.514635, 36.252962],
        zoom: 16,
    });

    DG.geoJson(nodes, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Колодец ' + feature.properties.Name + '.');
        }
    }).addTo(map);
    DG.geoJson(paths, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Труба, соединяющая участок ' + feature.properties.Begin_uch + ' и ' + feature.properties.End_uch);
        }
    }).addTo(map);

    DG.geoJson(sources, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Источник ' + feature.properties.Name + '.');
        }

    }).addTo(map);

    DG.geoJson(destinations, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Заход ' + feature.properties.Name + '.');
        }

    }).addTo(map);
});

