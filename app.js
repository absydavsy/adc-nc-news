const endpointsJson = require("./endpoints.json")
const { getApi } = require("./api.controller")
const express = require("express")
const app = express()


app.get('/api', getApi)

module.exports = app;
