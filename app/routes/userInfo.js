const { Router } = require('express')

const userController = require('../controllers/userInfo')

const userRouter = Router()

userRouter.get('/', userController.index)
// userRouter.get('/:email', userController.showEmail)
userRouter.get('/:id', userController.showId)
userRouter.post("/", userController.create)
userRouter.patch("/:id", userController.update)
userRouter.delete("/:id", userController.destroy)

//Registration and login routes
userRouter.post("/register", userController.register);
//userRouter.post("/login", userController.login);

module.exports = userRouter