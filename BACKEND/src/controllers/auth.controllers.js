const userModel = require('../models/auth.model.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
    const {email , name, password} = req.body;
    const userExists = await userModel.findOne({email});

    if (userExists) {
        return res.status(409).json({ error: 'User already exists' });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({ email, name, password: hashPassword });

        const token = await jwt.sign({
            id: newUser._id
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res) {
    const {email, password} = req.body;

    const userExists = await userModel.findOne({email})
    if(!userExists){
        return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await jwt.sign({
            id: userExists._id
        }, process.env.JWT_SECRET)

        res.cookie("token", token)


    res.status(200).json({ user: "User Logged In successfully" });
}

module.exports = {
    registerUser,
    loginUser
};