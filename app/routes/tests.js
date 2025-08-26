const { Router } = require('express')

const testController = require('../controllers/tests')

const testRouter = Router()

testRouter.get('/', testController.index)
testRouter.get('/:id', testController.showId)
testRouter.post('/', testController.create)

module.exports = testRouter