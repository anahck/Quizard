const { Router } = require('express')

const teacherController = require('../controllers/teacher')

const teacherRouter = Router()

teacherRouter.get('/:id', teacherController.showStudentClass)

module.exports = teacherRouter