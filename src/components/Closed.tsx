import React from "react"

function Closed({ send }) {
  const handleReset = () => {
    send("RESET")
  }

  return <button onClick={handleReset}>Reset</button>
}

export default Closed
