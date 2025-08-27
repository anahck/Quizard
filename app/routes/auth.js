const { Router } = require('express');
const authController = require('../controllers/auth');

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/verify-otp', authController.verifyOtp);

module.exports = authRouter;
