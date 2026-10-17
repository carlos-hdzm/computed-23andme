import { useCallback, useContext } from "react";
import {
  FileUploadContext,
  FileUploadDispatchContext,
  FileUploadPropsContext,
} from "./FileUploadContextProvider";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  FILE_TOO_LARGE_ERROR_CAUSE,
} from "../../constants/fileProcessing";
import type { ComputedData, DataAction } from "../../types";
import getSampleContextData from "../sample-data";
import contextActions from "../actions";

type UseFileUploadProps<T> = {
  processData?: (csvStr: string) => Promise<T>;
};

const useFileUpload = <T extends ComputedData>({
  processData,
}: UseFileUploadProps<T> = {}) => {
  const { isInitial, isPending, error, isDone, isSampleData } =
    useContext(FileUploadContext);
  const {
    setFile,
    setIsInitial,
    setIsPending,
    setError,
    setIsDone,
    setIsSampleData,
  } = useContext(FileUploadDispatchContext);
  const { onResolve } = useContext(FileUploadPropsContext);

  const processFile = useCallback(
    (file: File) => {
      if (isPending || !processData) return;

      setIsInitial(false);
      if (file.size > MAX_FILE_SIZE) {
        setError(
          new Error(
            `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`,
            { cause: FILE_TOO_LARGE_ERROR_CAUSE },
          ),
        );
        return;
      }

      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvStr = event.target?.result as string;
          processData(csvStr)
            .then((data: T) => {
              onResolve(data);
              setIsDone(true);
            })
            .catch((err: Error) => {
              setError(
                err
                  ? err
                  : /* v8 ignore next -- @preserve */ new Error(
                      "Unknown error processing data",
                    ),
              );
              console.error("Error processing data");
            })
            .finally(() => {
              setIsPending(false);
            });

          setIsPending(true);
        } catch (err) {
          setError(
            err
              ? (err as Error)
              : /* v8 ignore next -- @preserve */ new Error(
                  "Unknown error reading file",
                ),
          );
          setIsPending(false);
          console.error("Error processing file");
        }
      };
      reader.onerror = (event) => {
        setError(
          (event.target?.error as Error) ||
            new Error("Unknown error reading file"),
        );
        setIsPending(false);
        console.error("Error reading file");
      };

      reader.readAsText(file);
    },
    [
      isPending,
      processData,
      onResolve,
      setFile,
      setIsInitial,
      setIsPending,
      setError,
      setIsDone,
    ],
  );

  const handleSampleData = useCallback(
    (dispatch: React.ActionDispatch<[DataAction]>) => () => {
      setIsInitial(false);

      try {
        getSampleContextData()
          .then((sampleData) => {
            dispatch(contextActions.setSampleData(sampleData));
            setIsDone(true);
            setIsSampleData(true);
            if (error) setError(null);
          })
          .catch((err: Error) => {
            setError(
              err
                ? err
                : /* v8 ignore next -- @preserve */ new Error(
                    "Unknown error setting sample data",
                  ),
            );
            console.error("Error setting sample data");
          })
          .finally(() => {
            setIsPending(false);
          });

        setIsPending(true);
      } catch (err) {
        setError(
          err
            ? (err as Error)
            : /* v8 ignore next -- @preserve */ new Error(
                "Unknown error setting sample data",
              ),
        );
        setIsPending(false);
        console.error("Error setting sample data");
      }
    },
    [setIsInitial, setIsPending, setError, setIsDone, setIsSampleData, error],
  );

  const reset = useCallback(() => {
    setFile(null);
    setIsInitial(true);
    setIsPending(false);
    setError(null);
    setIsDone(false);
    if (isSampleData) setIsSampleData(false);
  }, [
    setFile,
    setIsInitial,
    setIsPending,
    setError,
    setIsDone,
    isSampleData,
    setIsSampleData,
  ]);

  return {
    processFile,
    reset,
    handleSampleData,
    state: {
      isInitial,
      isPending,
      error,
      isDone,
      isSampleData,
    },
  };
};

export default useFileUpload;
