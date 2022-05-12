import React from "react"

function NewCommit({ send }) {
  const registerNewCommit = () => {
    send("NEWCOMMIT")
  }

  return <button onClick={registerNewCommit}>New Commit</button>
}

export default NewCommit
