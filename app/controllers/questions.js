const Question = require('../models/Question')

async function index(req, res) {
    try {
        const questions = await Question.getAll()
        res.status(200).json(questions)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function showQId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const question = await Question.getOneByID(id)
        res.status(200).json(question)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function showTestId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const questions = await Question.getByTestID(id)
        res.status(200).json(questions)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newQuestion = await Question.create(data)
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const question = await Question.getOneByID(id)
        const result = await question.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const question = await Question.getOneByID(id)
        await question.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}


async function checkAnswers(req, res) {
    try {
        const { testId, answers } = req.body
        const userId = req.user.id

        // Get correct answers and total points
        const questions = await Question.getAnswersByTestID(testId)

        let totalScore = 0
        questions.forEach(question => {
            const userAnswerObj = answers.find(answer => answer.questionId === question.questionId)
            const userAnswer = (userAnswerObj?.answer || "").trim().toLowerCase()
            const correctAnswer = (question.answer || "").trim().toLowerCase()
            if (userAnswer === correctAnswer) {
                totalScore += question.totalScore
            }
        })

        // Save the score
        const scoreRecord = await Question.saveScore({ userid: userId, testid: testId, score: totalScore })

        res.status(200).json({ message: "Quiz submitted!", totalScore, scoreRecord })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// assuming input is in the form of 
// { "userId": 1, "testId": 1, "answers": [ { "questionId": 1, "answer": "Winston Churchill" }, ... ] }

// async function checkanswers(req, res) {
//     try {
//         const correctAnswers = await Question.getAnswersByTestID(testid)
//         const { userid, testid, answers } = req.body

//         const userAnswers = answers.map(question => question.answer);

//         let score = 0;

//         // Compare answers
//         for (let i = 0; i < answers.length; i++) {
//             if (correctAnswers[i] === userAnswers[i]) {
//                 console.log(`Question ${i + 1} Correct`);
//                 score++;
//             }
//         }

//         // Update the user's score in the DB
//         const newScore = await Question.updateScore(userid, testid, score);

//         res.status(200).json(newScore);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = {
    index,
    showQId,
    showTestId,
    create,
    update,
    destroy,
    checkAnswers
}