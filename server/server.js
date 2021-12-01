const express = require('express')
const app = express()
const port = 3001
const TablesEndpoints = require("./TablesEndpoints");
const { ENDPOINTS } = TablesEndpoints;

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

ENDPOINTS.forEach(endpoint => {
    // console.log(endpoint);
    app[endpoint.method](endpoint.endpoint, endpoint.callback);
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})