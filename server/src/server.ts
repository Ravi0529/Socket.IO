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
    console.log("User connected!", socket.id)

    // basic connection
    socket.emit("msg", `Stay connected at ${socket.id}`) // emit sends the message on the particular "id" itself
    // socket.broadcast.emit("msg", `Message sent by ${socket.id}`) // broadcast emit sends the message to all the users except "itself"

    // socket.on("message", (data) => {
    //     console.log(data)
    //     // io.emit("recieve-message", data) // use to send the message to all the users including ours, setting up on client side (io - sends to the entire socket)
    //     socket.broadcast.emit("recieve-message", data) // sends the message to all the ids present excluding ours
    // })

    socket.on("message", ({room, message}) => {
        console.log({room, message})
        io.to(room).emit("recieve-message", message) // used to send message to a room or an array of room
    })

    // // disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

httpServer.listen(PORT, () => {
    console.log("Server is active...")
})
