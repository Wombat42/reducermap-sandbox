import React from "react";

function handleAction(actionHandler, state, meta) {
  if (actionHandler) {
    return actionHandler(state, meta);
  }
  throw new TypeError("actionHandler was not set or was invalid");
}

function callHandlerTuple(handler, state, meta) {
  let [h, helpers] = handler;
  return { ...state, ...handleAction(h, state, { ...meta, ...helpers }) };
}

function callLastHandler(stack, state, meta) {
  if (stack.length > 0) {
    const lastHandler = stack.pop();
    return {
      ...state,
      ...lastHandler(state, meta)
    };
  }
  return state;
}

export function useReducerMap(actionMap, initialValue) {
  const ref = React.useRef();
  function mappingFunction(state, action) {
    let newState = { ...state };
    const { type } = action;
    const actionHandler = actionMap[type];
    let meta = { type, dispatcher: ref.current };

    // pre-handler: Lets you look at the reducer for all events.
    // Executes prior to a named event handler
    if (actionMap.pre) {
      newState = { ...newState, ...actionMap.pre(newState, meta) };
    }
    // You can have more than one handler for an action type;
    if (Array.isArray(actionHandler)) {
      const handlerStack = [];
      for (let index = 0; index < actionHandler.length; index++) {
        let tempHandler = actionHandler[index];
        //console.log(type, index, tempHandler);
        if (typeof tempHandler === "function") {
          newState = { ...callLastHandler(handlerStack, newState, meta) };
          handlerStack.push(tempHandler);
        } else if (Array.isArray(tempHandler)) {
          newState = { ...callLastHandler(handlerStack, newState, meta) };
          newState = { ...callHandlerTuple(tempHandler, newState, meta) };
        } else if (typeof tempHandler === "object") {
          const lastFunction = handlerStack.pop();
          newState = callHandlerTuple(
            [lastFunction, tempHandler],
            newState,
            meta
          );
        }
      }
      newState = { ...callLastHandler(handlerStack, newState, meta) };
    } else if (typeof actionHandler === "function") {
      // standalone function call
      newState = {
        ...newState,
        ...actionHandler(newState, meta)
      };
    }

    // post-handler: Executes after all the other handlers
    if (actionMap.post) {
      newState = { ...newState, ...actionMap.post(newState, meta) };
    }
    return newState;
  }
  const [state, dispatcher] = React.useReducer(mappingFunction, initialValue);
  ref.current = dispatcher;
  return [state, dispatcher];
}
