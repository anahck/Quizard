const express = require('express')
const cors = require('cors')

const userRouter = require('./routes/userInfo')
const testRouter = require('./routes/tests')
const logger = require('./middleware/logger')

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/users', userRouter)
app.use('/tests', testRouter)

module.exports = app