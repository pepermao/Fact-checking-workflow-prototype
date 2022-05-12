import { useMachine } from "@xstate/react";

export const usePersistedMachine = (StateMachine) => {

    const serializedState = localStorage.getItem("stored-state");

    let previousState;

    if (serializedState) {
        previousState = JSON.parse(serializedState);
        console.error("previousState", previousState);
    }

    return useMachine(StateMachine, {
        state: previousState        
    });
}