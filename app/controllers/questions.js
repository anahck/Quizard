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

module.exports = {
    index,
    showQId,
    showTestId,
    create,
    update,
    destroy
}