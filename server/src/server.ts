import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app) // providing EXPRESS to HTTP req
const PORT = 8000

const io = new Server(httpServer) // Initiate connection

io.on("connection", (socket) => { // Enabling connection

})

httpServer.listen(PORT, () => {
    console.log("Server is active...")
})
