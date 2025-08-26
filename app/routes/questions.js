const { Router } = require('express')

const questionController = require('../controllers/questions')

const questionRouter = Router()

questionRouter.post('/', questionController.checkanswers)


module.exports = questionRouter