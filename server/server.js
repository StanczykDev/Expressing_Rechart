import { TableColumns } from "./TableColumns";

const express = require('express')
const app = express()
const port = 3001

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})