const express = require('express')
const app = express()
const {getTopics, getEndpoints} = require('./controllers/topics-controller.js')
const {getArticleById, getArticles, updateVotes} = require('./controllers/articles-controller.js')
const {getCommentsByArticleId, postComment, deleteComment} = require('./controllers/comments-controller.js')
const {getUsers} = require('./controllers/users-controller.js')
const { handleCustomErrors, handleNonExistentId, handleOtherErrors, handleDatabaseErrors } = require('./controllers/errors-controller.js')
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.delete('/api/comments/:comment_id', deleteComment)

app.patch('/api/articles/:article_id', updateVotes)

app.use(handleCustomErrors)

app.use(handleNonExistentId)

app.use(handleDatabaseErrors)

app.use(handleOtherErrors)

module.exports = app