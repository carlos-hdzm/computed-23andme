import React, { createContext } from "react";
import type { ContextData, DataAction } from "./types";

export const AppContext = createContext<ContextData>({} as ContextData);
export const AppDispatchContext = createContext<React.ActionDispatch<[DataAction]>>((() => { }) as React.ActionDispatch<[DataAction]>);