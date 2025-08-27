const { Router } = require('express')

const questionController = require('../controllers/questions')

const questionRouter = Router()

questionRouter.get('/', questionController.index)
questionRouter.get('/tests/:id', questionController.showTestId)
questionRouter.get('/:id', questionController.showQId)
questionRouter.post('/', questionController.create)
questionRouter.patch('/:id', questionController.update)
questionRouter.delete('/:id', questionController.destroy)
questionRouter.post('/checkanswers', questionController.checkAnswers)

module.exports = questionRouter