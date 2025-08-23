const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");


async function home(req, res) {
    
    const {title} = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        name:title
    })

     res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });
}

async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({user: user._id}).sort({lastActivity: -1});

    res.status(200).json({
        message: "Chats fetched successfully",
        chats: chats
    })
}

async function getChatById(req, res) {
    const user = req.user;
    const chatId = req.params.id;

    const chat = (await messageModel.find({
                    chat: chatId,
                    user: user._id
                }).sort({createdAt: -1}).limit(20).lean()).reverse();

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    res.status(200).json({
        message: "Chat fetched successfully",
        chat: chat
    })
}

module.exports = {
    home, getChats, getChatById
}