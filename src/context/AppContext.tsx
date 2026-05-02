import React, { useCallback, useReducer } from "react";
import { dataReducer } from "./reducer";
import type { ChromosomeHaplotype, ComputedData } from "../types/objectTypes";
import { AppContext, AppDispatchContext } from "./context";
import contextActions from "./actions";
import { initialData } from "./initial-data";
import FileUploadContextProvider from "./FileUploadContext";
import getDataValues from "./contextUtil";

type AppContextProviderType = {
  children: React.ReactNode
}

const AppContextProvider: React.FC<AppContextProviderType> = ({ children }) => {
  // @ts-expect-error Different versions have different confidence types
  const [contextValue, dispatch] = useReducer(dataReducer, null, initialData);

  const saveData = useCallback((resolvedData: ComputedData<ChromosomeHaplotype>) => {
    if (!resolvedData) return;

    dispatch(contextActions.setData(resolvedData));
    const { version: selectedVersion, confidence: selectedConfidenceLevel } = getDataValues(resolvedData);

    dispatch(contextActions.setVersion(selectedVersion));
    dispatch(contextActions.setConfidence(selectedConfidenceLevel));
  }, [dispatch]);

  return (<FileUploadContextProvider onResolve={saveData}>
    <AppDispatchContext value={dispatch}>
      <AppContext value={contextValue}>
        {children}
      </AppContext>
    </AppDispatchContext>
  </FileUploadContextProvider>)
}

export default AppContextProvider;