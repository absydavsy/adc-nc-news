const endpointsJson = require("./endpoints.json")
const { getApi, getTopics, getArticleById, getArticles, getComments, postComment } = require("./api.controller")
const express = require("express")
const app = express()

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "does not exist"})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
  });

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app;
