const express = require('express')
const cors = require('cors')

const userRouter = require('./routes/userInfo')
const testRouter = require('./routes/tests')
const subjectRouter = require('./routes/subjects')
const scoreRouter = require('./routes/scores')
const questionRouter = require('./routes/questions')
const logger = require('./middleware/logger')

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/users', userRouter)
app.use('/tests', testRouter)
app.use('/subjects', subjectRouter)
app.use('/scores', scoreRouter)
app.use('/questions', questionRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Quizards API",
    description: "Learn about non-STEM subjects with these interactive online quizzes!"
  })
})

module.exports = app