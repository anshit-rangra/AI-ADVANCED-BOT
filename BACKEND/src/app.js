const cookieParser = require("cookie-parser");
const express = require("express")
const authRouter = require("./routes/auth.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const chatRoutes = require("./routes/chat.routes");
const cors = require("cors")

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use("/api/chats", authMiddleware, chatRoutes)

module.exports = app;
