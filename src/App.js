import React from "react";
import { useReducerMap } from "./reducermap.js";
import "./styles.css";

export default function App() {
  function testFunc(state) {
    console.log("in test func", state);
    return (state.updated = Date.now());
  }

  function hoHoTestFunc(state, meta) {
    const { type, helpers = [], dispatcher } = meta;
    console.log(meta);
    console.log("ho ho", state, type, helpers, dispatcher);
    const [setTestState] = helpers;
    console.log(setTestState);
    switch (type) {
      case "hey hey":
        if (setTestState) {
          setTestState(true);
          console.log("setting ho ho testState");
        }
        return { heyhey: Date.now() };
      case "ho ho":
        return { hoho: Date.now() };
      default:
        return { default: "I got called but I shouldn't have" };
    }
  }

  function otherTestFunc(state) {
    console.log("in other test func", state);
    state.updated = Date.now();
    return state;
  }
  const [testState, setTestState] = React.useState(false);

  const [state, dispatch] = React.useReducer(
    (oldState, rest) => {
      const newState = { ...oldState };
      newState[rest.type] = rest.data;
      console.log("in reducer", newState, rest);
      setTestState(true);
      testFunc(newState);
      return newState;
    },
    { attr: "some data" }
  );

  const [state2, dispatch2] = useReducerMap(
    {
      "hey hey": [otherTestFunc, [hoHoTestFunc, setTestState, testState]],
      "ho ho": hoHoTestFunc
    },
    { attr: "some data" }
  );

  return (
    <div
      className="App"
      onClick={(event) => {
        event.preventDefault();
        dispatch({ type: "hey hey", data: `flubber ${Date.now()}` });
        dispatch2({ type: "hey hey", data: `flubber ${Date.now()}` });
        dispatch2({ type: "ho ho", data: `${Date.now()}` });
        dispatch2({ type: "oh no", data: "hmmmm...." });
      }}
    >
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(state2, null, 2)}</pre>
      <div>{testState ? "true" : "false"}</div>
      {typeof testState}
    </div>
  );
}
