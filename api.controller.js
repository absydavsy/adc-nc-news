const endpointsJson = require("./endpoints.json")
const { selectTopics, selectArticleById, selectArticles, selectComments } = require("./api.model")

function getApi(req, res) {
    res.status(200).send({ endpoints: endpointsJson })
}
    

function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({ topics: topics })
    })
    .catch(next)
}

function getArticleById(req, res, next) {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
            res.status(200).send({ article })
        })
    .catch(next)
}

function getArticles(req, res, next) {
    selectArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    })
    .catch(next)
}

function getComments(req, res, next) {
    const { article_id } = req.params
    selectComments(article_id)
    .then((comments) => {
        console.log(comments)
        res.status(200).send({ comments })
    })
    .catch(next)

}


module.exports = { getApi, getTopics, getArticleById, getArticles, getComments }