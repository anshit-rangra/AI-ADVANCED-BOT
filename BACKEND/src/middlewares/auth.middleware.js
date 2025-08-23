const userModel = require("../models/auth.model.js");
const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error: "unauthorized"})
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({error: "unauthorized"})
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = authMiddleware