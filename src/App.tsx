import "./styles/App.css"
import CreateForm from "./components/createForm"
import AssignedForm from "./components/assignedForm"
import OpenPullForm from "./components/pullRequestForm"
import { usePersistedMachine } from "./hooks/usePersistedMachine"
import { GithubMachine } from "./machines/GitHubMachine"
import ReviewForm from "./components/reviewForm"
import NewCommit from "./components/newCommit"
import Closed from "./components/Closed"
import 'remirror/styles/all.css';

function App() {
  const [state, send, service] = usePersistedMachine(GithubMachine)

  service.onTransition(state => {
    try {
      localStorage.setItem("stored-state", JSON.stringify(state))
    } catch (e) {
      console.error("Unable to save to localStorage")
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        {state.matches("idle") && <CreateForm send={send} />}
        {state.matches("issueCreated") && <AssignedForm send={send} />}
        {state.matches("assigned") && <OpenPullForm send={send} />}
        {state.matches("inReview") && <ReviewForm />}
        {state.matches("inRevision") && <NewCommit send={send} />}
        {state.matches("closed") && <Closed send={send} />}

        <h6>Estado atual: {state.value}</h6>
      </header>
    </div>
  )
};


export default App