const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const user = await UserInfo.getOneByID(id)
        const result = await user.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const user = await UserInfo.getOneByID(id)
        await user.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
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

async function register(req, res) {
    try {
        const data = req.body

        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS))

        data["passwordhash"] = await bcrypt.hash(data.passwordhash, salt)
        const result = await UserInfo.create(data)

        res.status(201).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    const data = req.body
    try {
        const user = await UserInfo.getOneByEmail(data.email)
        const match = await bcrypt.compare(data.passwordhash, user.passwordhash)
        if(match){
            const payload = { email: user.email}
            const sendToken = (err, token) => {
                if(err){
                    throw Error("Error in token generation")
                }
                res.status(200).json({
                    success: true,
                    token: token
                })
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600}, sendToken)
        }
        else{
            throw Error("User could not be authenticated")
        }
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy,
    register,
    login
    //showEmail
}