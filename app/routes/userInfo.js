const { Router } = require('express')

const userController = require('../controllers/userInfo')

const userRouter = Router()

userRouter.get('/', userController.index)
// userRouter.get('/:email', userController.showEmail)
userRouter.get('/:id', userController.showId)
userRouter.post("/", userController.create)
userRouter.patch("/:id", userController.update)
userRouter.delete("/:id", userController.destroy)

module.exports = userRouter