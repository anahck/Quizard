const { Router } = require('express')

const scoreController = require('../controllers/scores')

const scoreRouter = Router()

scoreRouter.get('/', scoreController.index)
scoreRouter.get('/:id', scoreController.showScoreId)
scoreRouter.get('/users/:id', scoreController.showUserId)
scoreRouter.post('/', scoreController.create)
scoreRouter.patch('/:id', scoreController.update)
scoreRouter.delete('/:id', scoreController.destroy)

module.exports = scoreRouter