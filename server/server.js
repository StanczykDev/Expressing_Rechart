const express = require('express')
const app = express()
const port = 3001

app.get('/api', (req, res) => {
    console.log("Getting request");
    res.status(201).json({
        text: "Hello World!"
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})