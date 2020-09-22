import React from "react";

function handleAction(actionHandler, state, meta) {
  if (actionHandler) {
    return actionHandler(state, meta);
  }
  throw new TypeError("actionHandler was not set or was invalid");
}

export function useReducerMap(actionMap, initialValue) {
  const ref = React.useRef();
  function mappingFunction(state, action) {
    let newState = { ...state };
    const { type } = action;
    const actionHandler = actionMap[type];
    let meta = { type, dispatcher: ref.current };
    if (Array.isArray(actionHandler)) {
      newState = actionHandler.reduce((tState, handler) => {
        if (Array.isArray(handler)) {
          let [h, ...helpers] = handler;
          return {
            ...tState,
            ...handleAction(h, tState, { ...meta, helpers })
          };
        } else {
          return { ...tState, ...handleAction(handler, tState, meta) };
        }
      }, newState);
    } else if (typeof actionHandler === "function") {
      newState = {
        ...newState,
        ...handleAction(actionHandler, newState, meta)
      };
    }
    return newState;
  }
  const [state, dispatcher] = React.useReducer(mappingFunction, initialValue);
  ref.current = dispatcher;
  return [state, dispatcher];
}
