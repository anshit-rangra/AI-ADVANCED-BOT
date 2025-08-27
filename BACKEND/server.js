require("dotenv").config({ override: false });
const app = require("./src/app.js")
const connectDb = require("./src/db/db.js");
const http = require("http")
const initSocketServer = require("./src/socket/socket.server.js")


const httpServer = http.createServer(app)

initSocketServer(httpServer);

connectDb();


httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});