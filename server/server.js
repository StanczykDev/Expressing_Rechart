const express = require('express')
const app = express()
const port = 3001
const TablesEndpoints = require("./TablesEndpoints");
const DataGenerator = require("./DataGenerator")
const TablesIdentificators = require("./consts/TablesIdentificators");
const TablesColumns = require("./TablesColumns");

const { ENDPOINTS } = TablesEndpoints;
const { getRandomData, getRandomNumber } = DataGenerator;
const { generateColumns } = TablesColumns;
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
let cachedColumns = null;
let pointsQuantity;

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

const generateData = () => {
    pointsQuantity = getRandomNumber(8) + 2;
    cachedColumns = generateColumns(pointsQuantity);
    cachedData = getRandomData(pointsQuantity);
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

const getPreformedDataForGraph = () => {
    if (!cachedData) {
        return [];
    }

    let graphData = [];

    for (let i = 0; i < pointsQuantity; i++) {
        graphData[i] = {};
        graphData[i].name = `POINT ${i + 1}`;

        cachedData[TABLES_IDS.ACTORS].forEach((actor, index) => {
            graphData[i][actor.actorName] = cachedData[TABLES_IDS.VALUES][index].points[i];
        })
    }

    return graphData;
}

app.get('/api/update', (req, res) => {
    generateData();
    res.sendStatus(200);
})

app.get('/api/graphData', (req, res) => {
    res.json(getPreformedDataForGraph())
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})