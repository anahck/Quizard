const Score = require('../models/Score')

async function showStudentClass(req, res) {
    try {
        let id = parseInt(req.params.id)
        const scores = await Score.getByTeacherID(id)
        res.status(200).json(scores)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    showStudentClass
}