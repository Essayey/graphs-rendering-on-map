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

const setStyleOnLayerGroup = (layerGroup, layersToChange, styleCallback) => {
    if (layersToChange.length === 0) {
        layerGroup.eachLayer(layer => {
            styleCallback(layer)
        })
        return;
    }
    layerGroup.eachLayer(layer => {
        if (layersToChange.find(sys => sys === layer.feature.properties.Sys)) {
            styleCallback(layer)
        }
    })
}

const brokenElements = {
    nodes: [],
    paths: []
}

const writeBroken = () => {
    let inner = brokenElements.nodes.length ? ('Колодцы с Sys ' + brokenElements.nodes.join(', ') + '.</br>') : '';
    inner += brokenElements.paths.length ? ('Трубы с Sys ' + brokenElements.paths.join(', ') + '.') : '';
    document.getElementById('broken__elements').innerHTML = inner;
}

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

    const brokenIcon = DG.icon({
        iconUrl: '/img/broken.svg',
        iconRetinaUrl: '/img/broken.svg',
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


    const nodesLayer = DG.geoJson(nodes, {
        pointToLayer: (feature, latlng) => {
            return DG.marker(latlng, { icon: valveIcon });
        },
    });

    const pathsLayer = DG.geoJson(paths, {
        style: (feature) => {
            return { color: '#0f0' }
        }
    });

    const sourcesLayer = DG.geoJson(sources, {
        pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: sourceIcon }); },
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Источник ' + feature.properties.Name + '. Sys: ' + feature.properties.Sys);
        }

    });

    const destinationsLayer = DG.geoJson(destinations, {
        pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: valveIcon }); },
        onEachFeature: (feature, layer) => {
            layer.bindPopup('Заход ' + feature.properties.Name + '. Sys: ' + feature.properties.Sys);
        }

    });

    const layers = {
        nodes: nodesLayer,
        paths: pathsLayer,
        sources: sourcesLayer,
        dests: destinationsLayer
    }

    const resetStyles = () => {
        setStyleOnLayerGroup(layers.paths, [], layer => layer.setStyle({ color: '#0f0' }))
        setStyleOnLayerGroup(layers.nodes, [], layer => layer.setIcon(valveIcon))
        setStyleOnLayerGroup(layers.dests, [], layer => layer.setIcon(valveIcon))
        brokenElements.nodes = []
        brokenElements.paths = []
        writeBroken();
    }

    layers.nodes.eachLayer(layer => {
        layer.bindPopup(`<p>Колодец с Sys ${layer.feature.properties.Sys}</p><br/><button id='${layer.feature.properties.Sys}'>Смоделировать поломку</button>`)
            .on('popupopen', () => {
                pending = false;
                document.getElementById(layer.feature.properties.Sys).addEventListener('click', e => {
                    if (pending) return;
                    if (!brokenElements.nodes.find(sys => sys === layer.feature.properties.Sys)) {
                        brokenElements.nodes.push(layer.feature.properties.Sys);
                    }
                    writeBroken();
                    // resetStyles();
                    console.log('AJAX')
                    // AJAX REQUEST
                    fetch(`http://192.168.3.192/GetNames?type=node&sys=${layer.feature.properties.Sys}`)
                        .then(res => res.json())
                        .then(json => {
                            setStyleOnLayerGroup(layers.paths, json.paths, layer => layer.setStyle({ color: '#f00' }))
                            setStyleOnLayerGroup(layers.nodes, json.nodes, layer => layer.setIcon(brokenIcon))
                            setStyleOnLayerGroup(layers.dests, json.dest, layer => layer.setIcon(brokenIcon))
                        }
                        );

                    // Fake AJAX
                    // setTimeout(() => {
                    //     setStyleOnLayerGroup(layers.paths, [160, 113, 111, 162], layer => layer.setStyle({ color: '#f00' }))
                    //     setStyleOnLayerGroup(layers.nodes, [110, 159], layer => layer.setIcon(brokenIcon))
                    //     setStyleOnLayerGroup(layers.dests, [161, 112], layer => layer.setIcon(brokenIcon))
                    // }, 1000)
                    pending = true;
                })
            })
    })

    layers.paths.eachLayer(layer => {
        layer.bindPopup(`<p>Труба с Sys ${layer.feature.properties.Sys}</p><br/><button id='${layer.feature.properties.Sys}'>Смоделировать поломку</button>`)
            .on('popupopen', () => {
                pending = false;
                document.getElementById(layer.feature.properties.Sys).addEventListener('click', e => {
                    if (pending) return;
                    if (!brokenElements.paths.find(sys => sys === layer.feature.properties.Sys)) {
                        brokenElements.paths.push(layer.feature.properties.Sys);
                    }
                    writeBroken();
                    console.log('AJAX')
                    fetch(`http://192.168.3.192/GetNames?type=plot&sys=${layer.feature.properties.Sys}`)
                        .then(res => res.json())
                        .then(json => {
                            setStyleOnLayerGroup(layers.paths, json.paths, layer => layer.setStyle({ color: '#f00' }))
                            setStyleOnLayerGroup(layers.nodes, json.nodes, layer => layer.setIcon(brokenIcon))
                            setStyleOnLayerGroup(layers.dests, json.dest, layer => layer.setIcon(brokenIcon))
                        }
                        );
                    pending = true;
                })
            })
    })

    document.querySelector('.reset__btn').addEventListener('click', resetStyles)


    // Render

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


