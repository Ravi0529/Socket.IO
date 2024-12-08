import { io } from "socket.io-client"
import { useEffect } from "react"

const App = () => {

  const socket = io("http://localhost:8000")

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id)
    })

    // setting up emit and broadcast on console on front-end
    socket.on("msg", (s) => console.log(s))

    // clean-up function
    return () => {
      socket.disconnect()
    }
  }, [])


  return (
    <>
      <h1>Socket.IO</h1>
    </>
  )
}

export default App
