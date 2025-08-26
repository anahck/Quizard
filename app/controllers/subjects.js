const Subject = require('../models/Subject')

async function index(req, res) {
    try {
        const subjects = await Subject.getAll()
        res.status(200).json(subjects)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const subject = await Subject.getOneByID(id)
        res.status(200).json(subject)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newSubject = await Subject.create(data)
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const subject = await Subject.getOneByID(id)
        const result = await subject.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const subject = await Subject.getOneByID(id)
        await subject.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy
}