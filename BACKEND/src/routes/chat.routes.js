const express = require("express")
const chatControllers = require("../controllers/chat.controllers.js");

const router = express.Router();

router.route("/").post(chatControllers.home).get(chatControllers.getChats);
router.route("/:id").get(chatControllers.getChatById);

module.exports = router;