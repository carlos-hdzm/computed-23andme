import { useContext, useEffect } from "react";
import { expect, describe, test, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import FileUploadContextProvider, {
  FileUploadContext,
  FileUploadDispatchContext,
  FileUploadPropsContext,
} from "./FileUploadContextProvider";
import type { ComputedData } from "../../types";

describe("FileUploadContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onResolveMock = vi.fn();

  test("renders children", async () => {
    const { getByText } = await render(
      <FileUploadContextProvider onResolve={onResolveMock}>
        <div>Child Component</div>
      </FileUploadContextProvider>,
    );
    await expect.element(getByText("Child Component")).toBeInTheDocument();
  });

  test("provides context values and dispatch functions", async () => {
    const ConsumerTestComponent = ({
      mode = "initial",
    }: {
      mode?: "initial" | "update";
    }) => {
      const { file, isInitial, isPending, error, isDone, isSampleData } =
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

      useEffect(() => {
        if (mode === "update") {
          setFile(new File(["test"], "test.csv"));
          setIsInitial(false);
          setIsPending(true);
          setError(new Error("Test error"));
          setIsDone(true);
          setIsSampleData(true);
          onResolve({} as ComputedData);
        }
      }, [
        mode,
        onResolve,
        setFile,
        setIsInitial,
        setIsPending,
        setError,
        setIsDone,
        setIsSampleData,
      ]);

      return (
        <div>
          <p>File: {file?.name || "null"}</p>
          <p>Is Initial: {isInitial.toString()}</p>
          <p>Is Pending: {isPending.toString()}</p>
          <p>Error: {error?.message || "null"}</p>
          <p>Is Done: {isDone.toString()}</p>
          <p>Is Sample Data: {isSampleData.toString()}</p>
        </div>
      );
    };

    const { getByText, rerender } = await render(
      <FileUploadContextProvider onResolve={onResolveMock}>
        <ConsumerTestComponent />
      </FileUploadContextProvider>,
    );

    await expect.element(getByText("File: null")).toBeInTheDocument();
    await expect.element(getByText("Is Initial: true")).toBeInTheDocument();
    await expect.element(getByText("Is Pending: false")).toBeInTheDocument();
    await expect.element(getByText("Error: null")).toBeInTheDocument();
    await expect.element(getByText("Is Done: false")).toBeInTheDocument();
    await expect
      .element(getByText("Is Sample Data: false"))
      .toBeInTheDocument();

    await rerender(
      <FileUploadContextProvider onResolve={onResolveMock}>
        <ConsumerTestComponent mode="update" />
      </FileUploadContextProvider>,
    );

    await expect.element(getByText("File: test.csv")).toBeInTheDocument();
    await expect.element(getByText("Is Initial: false")).toBeInTheDocument();
    await expect.element(getByText("Is Pending: true")).toBeInTheDocument();
    await expect.element(getByText("Error: Test error")).toBeInTheDocument();
    await expect.element(getByText("Is Done: true")).toBeInTheDocument();
    await expect
      .element(getByText("Is Sample Data: true"))
      .toBeInTheDocument();
    expect(onResolveMock).toHaveBeenCalledWith({} as ComputedData);
  });
});
