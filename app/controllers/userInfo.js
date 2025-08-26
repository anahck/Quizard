const UserInfo = require('../models/UserInfo')

async function index(req, res) {
    try {
        const users = await UserInfo.getAll()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const user = await UserInfo.getOneByID(id)
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newUser = await UserInfo.create(data)
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

// async function showEmail(req, res) {
//     try {
//         let email = req.params.email
//         const user = await UserInfo.getOneByEmail(email)
//         res.status(200).json(user)
//     } catch (err) {
//         res.status(404).json({ error: err.message })
//     }
// }

module.exports = {
    index,
    showId,
    create
    //showEmail
}