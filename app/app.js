const express = require('express')
const cors = require('cors')

const userRouter = require('./routes/userInfo')
const logger = require('./middleware/logger')

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/users', userRouter)

module.exports = app