import React, { createContext, useMemo, useState } from "react";
import type { ChromosomeHaplotype, ComputedData } from "../../types";

type FileUploadContextValue = {
  file: File | null;
  isInitial: boolean;
  isPending: boolean;
  error: Error | null;
  isDone: boolean;
  isSampleData: boolean;
};

type FileUploadDispatchContextValue = {
  [Key in keyof FileUploadContextValue as `set${Capitalize<string & Key>}`]: React.Dispatch<React.SetStateAction<FileUploadContextValue[Key]>>;
};

type FileUploadPropsContextValue = {
  onResolve: <T extends ComputedData<ChromosomeHaplotype>>(data: T) => void;
};

type FileUploadContextProviderProps = {
  children: React.ReactNode;
} & FileUploadPropsContextValue;

const FileUploadContext = createContext<FileUploadContextValue>({
  file: null,
  isInitial: true,
  isPending: false,
  error: null,
  isDone: false,
  isSampleData: false,
});
const FileUploadDispatchContext = createContext<FileUploadDispatchContextValue>({
  setFile: () => {},
  setIsInitial: () => {},
  setIsPending: () => {},
  setError: () => {},
  setIsDone: () => {},
  setIsSampleData: () => {},
});
const FileUploadPropsContext = createContext<FileUploadPropsContextValue>({ onResolve: () => {} });

const FileUploadContextProvider: React.FC<FileUploadContextProviderProps> = ({ children, onResolve }) => {
  const [ file, setFile] = useState<File | null>(null);
  const [ isInitial, setIsInitial ] = useState(true);
  const [ isPending, setIsPending ] = useState(false);
  const [ error, setError ] = useState<Error | null>(null);
  const [ isDone, setIsDone ] = useState(false);
  const [ isSampleData, setIsSampleData ] = useState(false);

  const contextValue = useMemo(() => ({
    file,
    isInitial,
    isPending,
    error,
    isDone,
    isSampleData,
  }), [file, isInitial, isPending, error, isDone, isSampleData]);

  const contextDispatchValue = useMemo(() => ({
    setFile,
    setIsInitial,
    setIsPending,
    setError,
    setIsDone,
    setIsSampleData,
  }), [setFile, setIsInitial, setIsPending, setError, setIsDone, setIsSampleData]);

  return (
    <FileUploadPropsContext value={{ onResolve }}>
      <FileUploadDispatchContext value={contextDispatchValue}>
          <FileUploadContext value={contextValue}>
              {children}
          </FileUploadContext>
      </FileUploadDispatchContext>
    </FileUploadPropsContext>
  );
};

export default FileUploadContextProvider;
export { FileUploadContext, FileUploadDispatchContext, FileUploadPropsContext };