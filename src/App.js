import React from "react";
import { useReducerMap } from "./reducermap.js";
import "./styles.css";

export default function App() {
  function testFunc(state) {
    // console.log("in test func", state);
    return (state.updated = Date.now());
  }

  function hoHoTestFunc(state, meta) {
    const { type, helpers, dispatcher } = meta;
    dispatcher({ type: "new", data: "ok" });
    const { setTestState } = helpers;
    console.log(meta);
    switch (type) {
      case "hey hey":
        console.log("fd");
        if (setTestState) {
          console.log("setting test state");
          setTestState(true);
          // console.log("setting ho ho testState");
        }
        return { heyhey: Date.now() };
      case "ho ho":
        return { hoho: "hohotestfunction " + Date.now() };
      default:
        return { default: "I got called but I shouldn't have" };
    }
  }

  function otherTestFunc(state) {
    state.updated = Date.now();
    return state;
  }
  const [testState, setTestState] = React.useState(false);

  const [state, dispatch] = React.useReducer(
    (oldState, rest) => {
      const newState = { ...oldState };
      newState[rest.type] = rest.data;
      setTestState(true);
      testFunc(newState);
      return newState;
    },
    { attr: "some data" }
  );

  const [state2, dispatch2] = useReducerMap(
    {
      "hey hey": [otherTestFunc, [hoHoTestFunc, { setTestState, testState }]],
      "ho ho": [hoHoTestFunc, { setTestState, testState }],
      t: [
        () => {
          return { t: "got called" };
        }
      ],
      r: () => {
        return { r: "got called" };
      },
      pre: (state, meta) => {
        return;
      },
      post: (state, meta) => {
        return { counter: state.counter ? state.counter + 1 : 1 };
      }
    },
    { attr: "some data" }
  );

  const [state3, dispatch3] = useReducerMap(
    {
      new: (state, meta) => {
        dispatch2({ type: "new" });
        return { h: "I got called" };
      }
    },
    { attr: "some different data" }
  );

  return (
    <div
      className="App"
      onClick={(event) => {
        event.preventDefault();
        console.log("Calling!!");
        //dispatch({ type: "hey hey", data: `flubber ${Date.now()}` });
        dispatch2({ type: "hey hey", data: `flubber ${Date.now()}` });
        dispatch2({ type: "ho ho", data: `${Date.now()}` });
        dispatch2({ type: "oh no", data: "hmmmm...." });
        dispatch2({ type: "t" });
        dispatch2({ type: "r" });

        dispatch3({ type: "new", data: `${Date.now()}` });
      }}
    >
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(state2, null, 2)}</pre>
      <pre>{JSON.stringify(state3, null, 2)}</pre>
      <div>{testState ? "true" : "false"}</div>
      {typeof testState}
    </div>
  );
}
