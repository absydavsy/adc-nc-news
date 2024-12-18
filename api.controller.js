const endpointsJson = require("./endpoints.json")
const { selectTopics, selectArticleById, selectArticles, selectComments, addComment, updateArticleVotes, removeComment } = require("./api.model")

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
        res.status(200).send({ comments })
    })
    .catch(next)
}

function postComment(req, res, next) {
    const { username, body, article_id } = req.body
    const comment = { username, body, article_id }

    addComment(comment)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

function patchArticleVotes(req, res, next) {
    const { article_id } = req.params
    const { inc_votes } = req.body

    updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send( { updatedArticle })
    })
    .catch(next)
}

function deleteComment(req, res, next) {
    const { comment_id } = req.params

    removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)

}

module.exports = { getApi, getTopics, getArticleById, getArticles, getComments, postComment, patchArticleVotes, deleteComment }