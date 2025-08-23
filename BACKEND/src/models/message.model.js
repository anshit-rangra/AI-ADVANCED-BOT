const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats"
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model", "system"],
        default: "user"
    }
}, { timestamps: true });

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel