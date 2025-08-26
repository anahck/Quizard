const { Router } = require('express')

const subjectController = require('../controllers/subjects')

const subjectRouter = Router()

subjectRouter.get('/', subjectController.index)
subjectRouter.get('/:id', subjectController.showId)
subjectRouter.post('/', subjectController.create)
subjectRouter.patch('/:id', subjectController.update)
subjectRouter.delete('/:id', subjectController.destroy)

module.exports = subjectRouter