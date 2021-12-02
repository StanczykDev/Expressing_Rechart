const express = require('express')
const app = express()
const port = 3001
const TablesEndpoints = require("./TablesEndpoints");
const DataGenerator = require("./DataGenerator")

const { ENDPOINTS } = TablesEndpoints;
const { getRandomData } = DataGenerator;


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

const getDataCallbackProxy = dataCallback => {
    if (!cachedData) {
        cachedData = getRandomData();
    }

    return (res, req) => dataCallback(res, req, cachedData);
}

ENDPOINTS.forEach(endpointDescriptor => {
    const { method, endpoint } = endpointDescriptor;
    let callback = endpointDescriptor.callback;

    if (endpoint.split('/')[2] === "tablesData") {
        console.log("Yup");
        callback = getDataCallbackProxy(callback);
    }

    app[method](endpoint, callback);
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})