import { io } from "socket.io-client"
import { useState, useEffect, useMemo } from "react"

const App = () => {

  const socket = useMemo(() => io("http://localhost:8000"), [])

  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id)
    })

    // setting up emit and broadcast on console on front-end
    socket.on("msg", (s) => console.log(s))

    socket.on("recieve-message", (data) => { // sends the message (real time)
      console.log(data)
    })

    // clean-up function
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("message", inputValue) // use to watch the o/p (itself in terminal)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Submit Form</h2>
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
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
