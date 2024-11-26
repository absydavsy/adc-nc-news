const db = require("./db/connection")

function selectTopics() {
    return db.query("SELECT * FROM topics")
    .then(({rows}) => {
        return rows
    })
}

function selectArticleById(article_id) {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }
    
    let sqlQuery = "SELECT * FROM articles WHERE article_id = $1"
    const queryValues = [article_id]

    return db.query(sqlQuery, queryValues).then(( {rows} ) => {
        if (rows.length <= 0) {
            return Promise.reject({ status: 404, msg: "does not exist" })
        }
        return rows
    })
}


module.exports = { selectTopics, selectArticleById }