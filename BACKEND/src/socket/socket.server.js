const {Server} = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/auth.model.js")
const messageModel = require("../models/message.model.js")
const {generateResponse, generateVector} = require("../services/ai.service.js")
const { createMemoryVector, getMemoryVector } = require("../services/vector.service.js")

async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })

    io.use(async (socket, next) => {
        const token = cookie.parse(socket.handshake.headers?.token || "")
        if(!token.token) {
            return next(new Error("Authentication error"))
        }

        try {
            
            const decoded = jwt.verify(token.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user;
            next()
        } catch (error) {
            return next(new Error(error))
        }

    })

    io.on("connection", (socket) => {

        socket.on("ai-message", async (messagePayload) => {

            const [messageMod, vectors] = await Promise.all([
                await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            }),
            await generateVector(messagePayload.content)
            ])

            await createMemoryVector({
                vectors,
                messageId: messageMod._id,
                metadata: {
                    chat:  messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })

             

            const [memory, chatHistory] = await Promise.all([
                await getMemoryVector({
                queryVector: vectors,
                limit:3,
                metadata: {user: socket.user._id}
            }),
                (await messageModel.find({
                chat: messagePayload.chat
            }).sort({createdAt: -1}).limit(20).lean()).reverse()

            ])

            const stm = chatHistory.map((item)=> {
                return {
                    role: item.role,
                    parts: [ {text: item.content}]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [ {
                        text: `
                            these are some previous messages from the chat, use them to generate a response

                            ${memory.map(item => item.metadata.text).join("\n")}
                        `
                    }]
                }
            ]
            

            const response = await generateResponse([ ...ltm, ...stm])

            socket.emit("ai-message-response", {
                content: response,
                chat: messagePayload.chat
            })

            const [responseMessage, responseVectors] = await Promise.all([

                await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                }),                
                await generateVector(response)
            ])
            

            await createMemoryVector({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })

            

        })

        
    })
}

module.exports = initSocketServer;