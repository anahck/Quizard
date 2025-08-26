const Score = require('../models/Score')

async function index(req, res) {
    try {
        const scores = await Score.getAll()
        res.status(200).json(scores)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function showScoreId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const score = await Score.getOneByScoreID(id)
        res.status(200).json(score)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function showUserId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const scores = await Score.getByUserID(id)
        res.status(200).json(scores)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newScore = await Score.create(data)
        res.status(201).json(newScore);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const score = await Score.getOneByScoreID(id)
        const result = await score.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const score = await Score.getOneByScoreID(id)
        await score.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showScoreId,
    showUserId,
    create,
    update,
    destroy
}