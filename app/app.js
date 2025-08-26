const express = require('express')
const cors = require('cors')


const questionRouter = require('./routes/questions')
const logger = require('./middleware/logger')

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/questions', questionRouter)

module.exports = app