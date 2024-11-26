const endpointsJson = require("./endpoints.json")
const { getApi, getTopics, getArticleById } = require("./api.controller")
const express = require("express")
const app = express()

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "does not exist"})
})

app.use((err, req, res, next) => {
    console.log(err)
    if (err.status) {
        res.status(err.status).send( {msg: err.msg} )
    } else {
        res.status(500).send( {msg: "Internal server error"} )
    }
})

module.exports = app;
