import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
const httpServer = createServer(app) // providing EXPRESS to HTTP req
const PORT = 8000

const io = new Server(httpServer, {  // Initiate connection
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use(cors())

io.on("connection", (socket) => { // Enabling connection
    console.log("User connected!")
    console.log("Id", socket.id)

    // basic connection
    socket.emit("msg", `Stay connected at ${socket.id}`) // emit sends the message on the particular "id" itself
    socket.broadcast.emit("msg", `Message sent by ${socket.id}`) // broadcast emit sends the message to all the users except "itself"

    // // disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

httpServer.listen(PORT, () => {
    console.log("Server is active...")
})
