const {selectArticleById, selectArticles, editVotes} = require('../models/articles-model.js')

function getArticleById(request, response, next){
    const articleId = request.params.article_id

    return selectArticleById(articleId).then((article) => {
        response.status(200).send(article[0])
    }).catch(next)
};

function getArticles(request, response, next){
    let topic = request.query.topic

    return selectArticles(topic).then((articles) => {
        response.status(200).send(articles)
    }).catch(next)
}

function updateVotes(request, response, next){
    const articleId = request.params.article_id
    editVotes(articleId, request.body.inc_votes).then((newVotes) => {
        response.status(200).send({votes: newVotes.votes})
    }).catch(next)
}

module.exports = {getArticleById, getArticles, updateVotes}