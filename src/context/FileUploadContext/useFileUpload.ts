import { useCallback, useContext } from "react";
import { FileUploadContext, FileUploadDispatchContext, FileUploadPropsContext } from "./FileUploadContextProvider";
import type { ChromosomeHaplotypeSplit, ComputedData } from "../../types";

type UseFileUploadProps<T> = {
    processData?: (csvStr: string) => Promise<T>;
};

const useFileUpload = <T extends ComputedData>({ processData }: UseFileUploadProps<T> = {}) => {
    const { isInitial, isPending, error, isDone, isSampleData } = useContext(FileUploadContext);
    const { setFile, setIsInitial, setIsPending, setError, setIsDone, setIsSampleData } = useContext(FileUploadDispatchContext);
    const { onResolve } = useContext(FileUploadPropsContext);
    
    const processFile = useCallback((file: File) => {
        if (!processData) return;
        setFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csvStr = event.target?.result as string;
            processData(csvStr).then((data: T) => {
                onResolve(data);
                setIsDone(true);
            }).catch((err: Error) => {
                setError(err || new Error('Unknown error processing data'));
                console.error('Error processing data:', err);
            }).finally(() => {
                setIsPending(false);
            });
            setIsInitial(false);
            setIsPending(true);
          } catch (err) {
            setError(err as Error || new Error('Unknown error reading file'));
            console.error('Error processing file:', err);
          }
        };
        reader.onerror = (event) => {
            setError(event.target?.error || new Error('Unknown error reading file'));
            console.error('Error reading file:', event.target?.error);
        };
        reader.readAsText(file);
    }, [processData, onResolve, setFile, setIsInitial, setIsPending, setError, setIsDone]);

    const reset = useCallback(() => {
        setFile(null);
        setIsInitial(true);
        setIsPending(false);
        setError(null);
        setIsDone(false);
        if (isSampleData) setIsSampleData(false);
    }, [setFile, setIsInitial, setIsPending, setError, setIsDone, isSampleData, setIsSampleData]);

    const setUsingSampleData = useCallback(() => {
        setIsDone(true);
        setIsInitial(false);
        setIsPending(false);
        setIsSampleData(true);
    }, [setIsInitial, setIsPending, setIsDone, setIsSampleData]);

    return {
        processFile,
        reset,
        isSampleData,
        setUsingSampleData,
        isInitial,
        isPending,
        error,
        isDone,
    };
};

export default useFileUpload;