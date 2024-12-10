import { io } from "socket.io-client"
import { useState, useEffect, useMemo } from "react"

const App = () => {

  const socket = useMemo(() => io("http://localhost:8000"), [])

  const [inputValue, setInputValue] = useState<string>("")
  const [allMessages, setAllMessages] = useState<string[]>([])
  const [room, setRoom] = useState<string>("")
  const [socketid, setSocketid] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")

  useEffect(() => {
    socket.on("connect", () => {
      setSocketid(socket.id ?? "") // fallback in ts
      console.log("Connected", socket.id)
    })

    // setting up emit and broadcast on console on front-end
    socket.on("msg", (s) => console.log(s))

    socket.on("recieve-message", (data) => { // sends the message (real time)
      console.log(data)
      setAllMessages((allMessages) => [...allMessages, data])
    })

    // clean-up function
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("message", { message: inputValue, room }) // use to watch the o/p (itself in terminal)
    setInputValue("")
  }

  const joinRoomHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("join-room", roomName)
    setRoomName("")
  }

  return (
    <div className="justify-center items-center min-h-screen bg-gray-100">
      <form className="room bg-white p-6 rounded shadow-md w-96" onSubmit={joinRoomHandler}>
        <label
          htmlFor="inputValue"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Create a Room:
        </label>
        <input
          type="text"
          id="room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter Room name"
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 mt-5 mb-3 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join
        </button>
      </form>

      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Socket.IO</h2>
        <div className="mb-4">
          <label
            htmlFor="inputValue"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter a value:
          </label>
          <input
            type="text"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something..."
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room chat..."
            className="w-full px-4 py-2 mt-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
        <h3 className="id">
          {socketid}
        </h3>
      </form>

      <div className="container bg-white p-4 mt-6 rounded shadow-md w-96 max-h-96 overflow-y-auto">
        {
          allMessages.map((text: string, index) => (
            <div
              className="box border-b py-2 text-gray-800"
              key={index}
            >
              {text}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
