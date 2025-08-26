const Questions = require('../models/Questions')

// assuming input is in the form of 
// { "userId": 1, "testId": 1, "answers": [ { "questionId": 1, "answer": "Winston Churchill" }, ... ] }

async function checkanswers(req, res) {
    try {
        const correctAnswers = await Questions.getAnswers(); 

        const { userid, testid, answers } = req.body;

        const userAnswers = answers.map(question => question.answer);

        let score = 0;

        // Compare answers
        for (let i = 0; i < answers.length; i++) {
            if (correctAnswers[i] === userAnswers[i]) {
                console.log(`Question ${i + 1} Correct`);
                score++;
            }
        }

        // Update the user's score in the DB
        const newScore = await Questions.updateScore(userid, testid, score);

        res.status(200).json(newScore);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    checkanswers
}