var map;

const graph = {
    vertices: [
        { id: 0, x: 54.515724, y: 36.245781 }, // 54.515724° 36.245781°
        { id: 1, x: 54.515507, y: 36.247707 }, // 54.515507° 36.247707°
        { id: 2, x: 54.517602, y: 36.248699 }, // 54.517602° 36.248699°
        { id: 3, x: 54.517255, y: 36.251785 }, // 54.517255° 36.251785°

        { id: 4, x: 54.51688, y: 36.254421 }, // 54.51688° 36.254421°
        { id: 5, x: 54.514741, y: 36.253492 }, // 54.514741° 36.253492°
        { id: 6, x: 54.514494, y: 36.255821 }, // 54.514494° 36.255821°
        { id: 7, x: 54.51383, y: 36.261302 }, // 54.51383° 36.261302°
        { id: 8, x: 54.512215, y: 36.26038 }, // 54.512215° 36.26038°
    ],
    edges: [{ vertexId1: 0, vertexId2: 1 },
    { vertexId1: 1, vertexId2: 2 },
    { vertexId1: 2, vertexId2: 3 },
    { vertexId1: 1, vertexId2: 3 },

    { vertexId1: 3, vertexId2: 4 },
    { vertexId1: 1, vertexId2: 5 },

    { vertexId1: 4, vertexId2: 5 },
    { vertexId1: 5, vertexId2: 6 },
    { vertexId1: 6, vertexId2: 7 },
    { vertexId1: 6, vertexId2: 8 }],
}

// TODO
// Необходимо добавить поле state в узел, оно будет показывать, исправен ли данный узел или нет.
// Затем, при отрисовке связей, отходящих от неисправного узла, выбирать цвет линии (красный - линия неисправна)
// Также, необходимо провести декомпозицию, возможно добавить отдельные функции для отрисовки узлов и линий связи.



DG.then(function () {
    map = DG.map('map', {
        center: [54.514635, 36.252962],
        zoom: 16,
    });
    graph.vertices.forEach(node => DG.circleMarker([node.x, node.y])
        .bindPopup(`Узел водоснабжения с координатами ${node.x}, ${node.y}, уникальный идентификатор ${node.id}`)
        .addTo(map));
    graph.edges.forEach(edge => DG.polyline([
        [graph.vertices[edge.vertexId1].x, [graph.vertices[edge.vertexId1].y]],
        [graph.vertices[edge.vertexId2].x, [graph.vertices[edge.vertexId2].y]]
    ])
        .bindPopup(`Линия водоснабжения, связывающая узлы ${edge.vertexId1} и ${edge.vertexId2}`)
        .addTo(map));
});