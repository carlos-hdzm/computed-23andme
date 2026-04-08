import React, { useReducer } from "react";
import { dataReducer } from "./reducer";
import type { ComputedData } from "../types/objectTypes";
import { AppContext, AppDispatchContext } from "./context";
import { sampleData } from "./sample-data";

type AppContextProviderType = {
  children: React.ReactNode
}

const AppContextProvider: React.FC<AppContextProviderType> = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, sampleData);
  // const [data, dispatch] = useReducer(dataReducer, {} as ComputedData);

  return (<AppContext value={data}>
    <AppDispatchContext value={dispatch}>
      {children}
    </AppDispatchContext>
  </AppContext>)
}

export default AppContextProvider;