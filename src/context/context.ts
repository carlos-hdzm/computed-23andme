import React, { createContext } from "react";
import type { ContextData, DataAction } from "./reducer";

export const AppContext = createContext({} as ContextData);
export const AppDispatchContext = createContext((() => { }) as React.ActionDispatch<[DataAction]>);