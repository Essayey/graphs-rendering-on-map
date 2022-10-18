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

// const brokenPaths = {
//     sys: [160, 111, 113, 15, 16]
// }

// const brokenNodes = {
//     sys: [12, 13, 14, 15, 16]
// }

// fetch('http://192.168.3.192/GetNames?type=node&sys=2', {
//     method: 'get',
// }).then(res => res.json()).then(json => {

//     brokenNodes.sys = json.nodes;
//     brokenPaths.sys = json.paths
// });

// const showSelectedElementData = (feature) => {
//     const brokenPaths = {
//         sys: []
//     }

//     const brokenNodes = {
//         sys: []
//     }

//     fetch(`http://192.168.3.192/GetNames?type=${feature.type}&sys=${feature.sys}`, {
//         method: 'get',
//     }).then(res => res.json()).then(json => {
//         layers['nodes'].setStyle()
//         brokenNodes.sys = json.nodes;
//         brokenPaths.sys = json.paths
//     });
// }

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
        // onEachFeature: (feature, layer) => {
        //     layer.bindPopup('Колодец ' + feature.properties.Name + '. Sys: ' + feature.properties.Sys);
        // }
    });

    const pathsLayer = DG.geoJson(paths, {
        // onEachFeature: (feature, layer) => {
        //     layer.bindPopup('Труба, соединяющая участок ' + feature.properties.Begin_uch + ' и ' + feature.properties.End_uch + '. Sys: ' + feature.properties.Sys);
        // },
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
        // pointToLayer: (geoJsonPoint, latlng) => { return DG.marker(latlng, { icon: valveIcon }); },
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

    layers.nodes.eachLayer(layer => {
        layer.bindPopup(`<p>Колодец с Sys ${layer.feature.properties.Sys}</p><br/><button id='${layer.feature.properties.Sys}'>Смоделировать поломку</button>`)
            .on('popupopen', () => {
                pending = false;
                document.getElementById(layer.feature.properties.Sys).addEventListener('click', e => {
                    if (pending) return;
                    console.log('AJAX')
                    // AJAX REQUEST
                    // fetch(`http://192.168.3.192/GetNames?type=node&sys=${layer.feature.properties.Sys}`)
                    //     .then(res => res.json())
                    //     .then(json => {
                    //         setStyleOnLayerGroup(layers.paths, json.paths, layer => layer.setStyle({ color: '#f00' }))
                    //         setStyleOnLayerGroup(layers.nodes, json.nodes, layer => layer.setIcon(brokenIcon))
                    //         setStyleOnLayerGroup(layers.dests, json.dest, layer => layer.setIcon(brokenIcon))
                    //     }
                    //     );


                    // Fake AJAX
                    setTimeout(() => {
                        setStyleOnLayerGroup(layers.paths, [160, 113, 111], layer => layer.setStyle({ color: '#f00' }))
                        setStyleOnLayerGroup(layers.nodes, [110], layer => layer.setIcon(brokenIcon))
                        setStyleOnLayerGroup(layers.dests, ['none'], layer => layer.setIcon(brokenIcon))
                    }, 1000)
                    pending = true;
                })
            })
            .on('popupclose', () => {
                setStyleOnLayerGroup(layers.paths, [], layer => layer.setStyle({ color: '#0f0' }))
                setStyleOnLayerGroup(layers.nodes, [], layer => layer.setIcon(valveIcon))
                setStyleOnLayerGroup(layers.dests, [], layer => layer.setIcon(valveIcon))
            })
    })

    layers.paths.eachLayer(layer => {
        layer.bindPopup(`<p>Труба с Sys ${layer.feature.properties.Sys}</p><br/><button id='${layer.feature.properties.Sys}'>Смоделировать поломку</button>`)
            .on('popupopen', () => {
                pending = false;
                document.getElementById(layer.feature.properties.Sys).addEventListener('click', e => {
                    if (pending) return;
                    console.log('AJAX')
                    fetch(`http://192.168.3.192/GetNames?type=path&sys=${layer.feature.properties.Sys}`)
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
            .on('popupclose', () => {
                setStyleOnLayerGroup(layers.paths, [], layer => layer.setStyle({ color: '#0f0' }))
                setStyleOnLayerGroup(layers.nodes, [], layer => layer.setIcon(valveIcon))
                setStyleOnLayerGroup(layers.dests, [], layer => layer.setIcon(valveIcon))
            })
    })


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


