const express = require('express')
const app = express()
const port = 3001
const TablesEndpoints = require("./TablesEndpoints");
const DataGenerator = require("./DataGenerator")
const TablesIdentificators = require("./consts/TablesIdentificators");
const TablesColumns = require("./TablesColumns");

const { ENDPOINTS } = TablesEndpoints;
const { getRandomData, getRandomNumber, getRandomColor, VALUE_1_MAX,
        getScatterData, treeData, sankeyData} = DataGenerator;
const { generateColumns, generatePieColumns } = TablesColumns;
const { TABLES_IDS } = TablesIdentificators;

app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/api', (req, res) => {
    console.log("Getting request");
    res.status(201);
})

app.get('/api/message', (req, res) => {
    res.json({
        text: "Hello World!"
    })
})

app.get('/api/anotherMessage', (req, res) => {
    res.json({
        text: "Also Some Message"
    })
})

let cachedData = null;
let cachedPieData = null;
let cachedScatterData = null;
let cachedColumns = null;
let currentMaxValue = VALUE_1_MAX;
let pointsQuantity;
let currentActorsQuantity;
let currentGraphType = null;

const deriveValuesDataForTables = () =>
    cachedData[TABLES_IDS.VALUES].map((valuesSet => ({
            ...valuesSet.points.reduce((pointsDTO, point, index) => {
                pointsDTO[`point${index + 1}`] = point;
                return pointsDTO;
            }, {}),
            actorId: valuesSet.actorId
        })
    ))


const getPreformedDataForTables = () => ({
    ...cachedData,
    [TABLES_IDS.VALUES]: deriveValuesDataForTables()
})

const generateData = (receivedPointsQuantity = getRandomNumber(8) + 2,
                      actorsQuantity = getRandomNumber(8) + 2,
                      maxValue = currentMaxValue,
                      graphType) => {
    pointsQuantity = receivedPointsQuantity || getRandomNumber(8) + 2;
    currentActorsQuantity = actorsQuantity || getRandomNumber(8) + 2;
    currentGraphType = graphType;
    currentMaxValue = maxValue;

    if (currentGraphType === "pie") {
        pointsQuantity = 2;
    }

    if (currentGraphType === "funnel") {
        pointsQuantity = 1;
    }

    if (currentGraphType === "scatter") {
        currentActorsQuantity = 3;
    }

    if (currentGraphType === "radar" && pointsQuantity < 3) {
        pointsQuantity = 3;
    }

    if (currentGraphType === "scatter") {
        cachedScatterData = getScatterData(pointsQuantity, currentActorsQuantity, currentMaxValue);
        return;
    }

    cachedColumns = generateColumns(pointsQuantity);
    cachedData = getRandomData(pointsQuantity, currentActorsQuantity, maxValue);
}

generateData();

const getDataCallbackProxy = dataCallback => {
    return (req, res) => {
        dataCallback(req, res, getPreformedDataForTables());
    }
}



ENDPOINTS.forEach(endpointDescriptor => {
    const { method, endpoint } = endpointDescriptor;
    let callback = endpointDescriptor.callback;

    if (endpoint.split('/')[2] === "tablesData") {
        callback = getDataCallbackProxy(callback);
    }

    if (endpoint.split('/')[3] === "columns") {
        callback = (req, res) => {
            res.json({
                columns: cachedColumns[endpoint.split('/')[2]]
            });
        };
    }

    app[method](endpoint, callback);
})

const deriveGraphDataFromValueObject = index => {
    const graphData = {...cachedData[TABLES_IDS.VALUES][index]};

    delete graphData.actorId;
    // for (let key in valueData) {
    //     if (key !== "actorId") {
    //         graphData.push({
    //             name: key,
    //             value: valueData
    //         })
    //     }
    // }

    return graphData;
}

const getPreformedPieData = () => {
    const pieData = [
        {
            color: getRandomColor(),
            data: []
        },
        {
            color: getRandomColor(),
            data: []
        }];

    for (let i = 0; i < cachedData[TABLES_IDS.ACTORS].length; i++) {
        pieData[0].data.push({
            value: cachedData[TABLES_IDS.VALUES][i].points[0],
            name: cachedData[TABLES_IDS.ACTORS][i].actorName,
            color: cachedData[TABLES_IDS.ACTORS][i].actorColor,
            fill: cachedData[TABLES_IDS.ACTORS][i].actorColor
        });

        pieData[1].data.push({
            value: cachedData[TABLES_IDS.VALUES][i].points[1],
            name: cachedData[TABLES_IDS.ACTORS][i].actorName
        });
    }

    return pieData;
}

const getPreformedDataForGraph = () => {
    if (!cachedData) {
        return [];
    }

    let graphData = [];

    for (let i = 0; i < pointsQuantity; i++) {
        graphData[i] = {};
        graphData[i].name = `POINT ${i + 1}`;

        graphData[i].fullMark = parseInt(currentMaxValue);
        graphData[i].fill = getRandomColor();

        cachedData[TABLES_IDS.ACTORS].forEach((actor, index) => {
            graphData[i][actor.actorName] = cachedData[TABLES_IDS.VALUES][index].points[i];
        })
    }

    console.log(graphData);

    return graphData;
}

app.put('/api/update', (req, res) => {
    const { body = {} } = req;

    generateData(body.pointsQuantity, body.actorsQuantity, body.maxValue, body.graphType);
    res.sendStatus(200);
})

app.put('/api/graphData', (req, res) => {
    console.log(req.body);
    if (req.body.type === "pie" || req.body.type === "funnel") {
        res.json(getPreformedPieData())
    }

    if (req.body.type === "scatter") {
        const colors = [];

        for (let i = 0; i < cachedScatterData.length; i++) {
            colors.push(getRandomColor());
        }

        const preformedData = {
            data: cachedScatterData,
            colors
        }

        res.json(preformedData);
    }

    if (req.body.type === "treeMap") {
        res.json({
            color: getRandomColor(),
            data: treeData
        })
    }

    if (req.body.type === "sankey") {
        res.json({
            color: getRandomColor(),
            data: sankeyData
        })
    }

    res.json(getPreformedDataForGraph())
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})