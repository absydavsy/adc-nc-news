const endpointsJson = require("./endpoints.json")
const { getApi, getTopics } = require("./api.controller")
const express = require("express")
const app = express()

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "not found"})
})

module.exports = app;
