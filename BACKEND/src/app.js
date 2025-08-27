const cookieParser = require("cookie-parser");
const express = require("express");
const authRouter = require("./routes/auth.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const chatRoutes = require("./routes/chat.routes");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public")));


// API routes
app.use("/api/auth", authRouter);
app.use("/api/chats", authMiddleware, chatRoutes);

// Fallback for React Router
app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
