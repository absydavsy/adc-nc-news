const db = require("./db/connection")

function selectTopics() {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

function selectArticleById(article_id) {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }
    
    let sqlQuery = `SELECT * FROM articles WHERE article_id = $1`
    const queryValues = [article_id]

    return db.query(sqlQuery, queryValues)
    .then(( {rows} ) => {
        if (rows.length <= 0) {
            return Promise.reject({ status: 404, msg: "does not exist" })
        } else {
            return rows
        } 
    })
}

function selectArticles() {
    return db.query(`SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`)
    .then(({ rows }) => {
        return rows 
    })
}

function selectComments(article_id) {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }

    let sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    const queryValues = [article_id]

    return db.query(sqlQuery, queryValues)
    .then(({ rows }) => {
        if (rows.length <= 0) {
            return Promise.reject({ status: 404, msg: "does not exist"})
        }
        return rows
    })
}

function addComment(comment) {
    const { username, body, article_id } = comment

    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad request" })
    }

    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, author, body, article_id, votes, created_at`, [username, body, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
}

function updateArticleVotes(article_id, inc_votes) {
    if(isNaN(inc_votes) || isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad request" })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
    .then(({ rows }) => {
        if (rows.length <= 0) {
            return Promise.reject( { status: 404, msg: "does not exist" })
        }
        return rows[0]
    })
}

module.exports = { selectTopics, selectArticleById, selectArticles, selectComments, addComment, updateArticleVotes }