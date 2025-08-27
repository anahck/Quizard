const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserInfo = require('../models/UserInfo');

const otpStore = {};

async function register(req, res) {
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        data["passwordhash"] = await bcrypt.hash(data.passwordhash, salt);
        const result = await UserInfo.create(data);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const user = await UserInfo.getOneByEmail(data.email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const match = await bcrypt.compare(data.passwordhash, user.passwordhash);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if (user.userrole.toLowerCase() == 'developer') {
            // Bypass MFA for developer accounts
            const payload = { email: user.email };
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) => {
                if (err)return res.status(500).json({ error: 'Error in token generation' });
                res.status(200).json({ success: true, token, userid: user.userid});
            });
        } else {
            const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
            otpStore[user.email] = {
                otp,
                expires: Date.now() + 5 * 60 * 1000 // 5 minutes
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your Quizard OTP',
                text: `Your OTP is: ${otp}`
            });
            res.status(200).json({ success: true, message: 'OTP sent to email.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function verifyOtp(req, res) {
    try {
        const data = req.body;
        const user = await UserInfo.getOneByEmail(data.email);
        const record = otpStore[data.email];
        if (!record) {
            return res.status(400).json({ error: 'No OTP requested for this email' });
        }
        if (Date.now() > record.expires) {
            delete otpStore[data.email];
            return res.status(400).json({ error: 'OTP expired' });
        }
        if (record.otp !== data.otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }
        const payload = { email: data.email };
        jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) => {
            if (err) {
                return res.status(500).json({ error: 'Error in token generation' });
            }
            delete otpStore[data.email];
            res.status(200).json({ success: true, token, userid: user.userid });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    verifyOtp
};
