const endpointsJson = require("./endpoints.json")
const { selectTopics, selectArticleById } = require("./api.model")

function getApi(req, res) {
    res.status(200).send({ endpoints: endpointsJson })
}

function getTopics(req, res) {
    selectTopics().then((topics) => {
        res.status(200).send({ topics: topics })
    })
}

function getArticleById(req, res, next) {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
            res.status(200).send({ article })
        })
    .catch(next)
}




module.exports = { getApi, getTopics, getArticleById }