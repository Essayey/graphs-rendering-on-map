let map;
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



DG.then(() => {
    map = DG.map('map', {
        center: [54.514635, 36.252962],
        zoom: 16,
    });
    const valveIcon = DG.icon({
        iconUrl: '/img/valve.svg',
        iconRetinaUrl: '/img/valve.svg',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, 0],
    });

    const sourceIcon = DG.icon({
        iconUrl: '/img/source.svg',
        iconRetinaUrl: '/img/source.svg',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, 0],
    });

    const destinationIcon = DG.icon({
        iconUrl: '/img/destination.svg',
        iconRetinaUrl: '/img/destination.svg',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, 0],
    });


    const nodesLayer = DG.geoJson(nodes, {
        pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: valveIcon }); },
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Колодец ' + feature.properties.Name + '.');
        }
    });

    const pathsLayer = DG.geoJson(paths, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Труба, соединяющая участок ' + feature.properties.Begin_uch + ' и ' + feature.properties.End_uch);
        }
    });

    const sourcesLayer = DG.geoJson(sources, {
        pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: sourceIcon }); },
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Источник ' + feature.properties.Name + '.');
        }

    });

    const destinationsLayer = DG.geoJson(destinations, {
        pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: destinationIcon }); },
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Заход ' + feature.properties.Name + '.');
        }

    });

    const layers = {
        nodes: nodesLayer,
        paths: pathsLayer,
        sources: sourcesLayer,
        dests: destinationsLayer
    }
    const layersState = {
        nodes: false,
        paths: false,
        dests: false,
        sources: false
    }

    document.querySelectorAll('.control__btn').forEach(domNode => {
        domNode.addEventListener('click', e => {
            if (layersState[e.target.id]) {
                layers[e.target.id].remove();
                e.target.innerHTML = 'Показать';
                layersState[e.target.id] = false;
            }
            else {
                layers[e.target.id].addTo(map);
                e.target.innerHTML = 'Скрыть';
                layersState[e.target.id] = true;
            }
        })
    })
});

