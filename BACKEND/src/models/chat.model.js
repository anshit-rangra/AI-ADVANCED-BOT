const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users", 
        required:true
    }, 
    name: {
        type: String, 
        required: true
    }

}, { timestamps: true })

const chatModel = mongoose.model("chats", chatSchema)

module.exports = chatModel;