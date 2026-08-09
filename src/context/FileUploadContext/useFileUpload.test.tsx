import { expect, describe, test, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook } from "vitest-browser-react";
import useFileUpload from "./useFileUpload";
import type { ComputedData } from "../../types";
import FileUploadContextProvider from "./FileUploadContextProvider";

const onResolveMock = vi.fn();

const TestComponent = ({
  processData,
}: {
  processData?: (csvStr: string) => Promise<ComputedData>;
}) => {
  const {
    processFile,
    reset,
    setUsingSampleData,
    state: { isInitial, isPending, error, isDone, isSampleData },
  } = useFileUpload({
    processData,
  });

  return (
    <div>
      <p>Is Initial: {isInitial.toString()}</p>
      <p>Is Pending: {isPending.toString()}</p>
      <p>Error: {error?.message || "null"}</p>
      <p>Is Done: {isDone.toString()}</p>
      <p>Is Sample Data: {isSampleData.toString()}</p>
      <button
        data-testid="process-file"
        onClick={() => processFile(new File(["test"], "test.csv"))}
      >
        Process File
      </button>
      <button data-testid="reset" onClick={() => reset()}>
        Reset
      </button>
      <button data-testid="sample-data" onClick={() => setUsingSampleData()}>
        Sample Data
      </button>
    </div>
  );
};

const renderTestComponent = async (
  processData?: (csvStr: string) => Promise<ComputedData>,
) => {
  return await render(
    <FileUploadContextProvider onResolve={onResolveMock}>
      <TestComponent processData={processData} />
    </FileUploadContextProvider>,
  );
};

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initial state", async () => {
    const { result } = await renderHook(() => useFileUpload());

    expect(result.current).toEqual({
      processFile: expect.any(Function),
      reset: expect.any(Function),
      setUsingSampleData: expect.any(Function),
      state: {
        isInitial: true,
        isPending: false,
        error: null,
        isDone: false,
        isSampleData: false,
      },
    });
  });

  test("success processing file", async () => {
    const processDataMock = vi.fn().mockResolvedValue({} as ComputedData);

    const { getByText, getByTestId } =
      await renderTestComponent(processDataMock);

    await getByTestId("process-file").click();

    const expectedState = {
      isInitial: false,
      isPending: false,
      error: null,
      isDone: true,
      isSampleData: false,
    };

    await expect
      .element(getByText(`Is Initial: ${expectedState.isInitial}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Pending: ${expectedState.isPending}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Error: ${expectedState.error}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Done: ${expectedState.isDone}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
      .toBeInTheDocument();
    expect(onResolveMock).toHaveBeenCalledWith({} as ComputedData);
  });

  test("error processing file", async () => {
    const processDataMock = vi.fn().mockRejectedValue(new Error("Test error"));

    const { getByText, getByTestId } =
      await renderTestComponent(processDataMock);

    await getByTestId("process-file").click();

    const expectedState = {
      isInitial: false,
      isPending: false,
      error: "Test error",
      isDone: false,
      isSampleData: false,
    };

    await expect
      .element(getByText(`Is Initial: ${expectedState.isInitial}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Pending: ${expectedState.isPending}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Error: ${expectedState.error}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Done: ${expectedState.isDone}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
      .toBeInTheDocument();
    expect(onResolveMock).not.toHaveBeenCalled();
  });

  test("reader onload error", async () => {
    const processDataMock = vi.fn().mockImplementation(() => {
      throw new Error("Reader error");
    });

    const { getByText, getByTestId } =
      await renderTestComponent(processDataMock);

    await getByTestId("process-file").click();

    const expectedState = {
      isInitial: true,
      isPending: false,
      error: "Reader error",
      isDone: false,
      isSampleData: false,
    };

    await expect
      .element(getByText(`Is Initial: ${expectedState.isInitial}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Pending: ${expectedState.isPending}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Error: ${expectedState.error}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Done: ${expectedState.isDone}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
      .toBeInTheDocument();
    expect(onResolveMock).not.toHaveBeenCalled();
  });

  test("reader onerror", async () => {
    vi.spyOn(
      globalThis.FileReader.prototype,
      "readAsText",
    ).mockImplementationOnce(function (this: FileReader) {
      this.onerror?.(new ProgressEvent("error") as ProgressEvent<FileReader>);
    });

    vi.useFakeTimers();

    const processDataMock = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({} as ComputedData), 1000);
      });
    });

    const { getByText, getByTestId } =
      await renderTestComponent(processDataMock);

    await getByTestId("process-file").click();
    vi.advanceTimersByTime(500); // Advance time to simulate the reader onerror event

    const expectedState = {
      isInitial: false,
      isPending: false,
      error: "Unknown error reading file",
      isDone: false,
      isSampleData: false,
    };

    await expect
      .element(getByText(`Is Initial: ${expectedState.isInitial}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Pending: ${expectedState.isPending}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Error: ${expectedState.error}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Done: ${expectedState.isDone}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
      .toBeInTheDocument();
    expect(onResolveMock).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  describe("reset", async () => {
    test("reset after uploading file", async () => {
      const processDataMock = vi.fn().mockResolvedValue({} as ComputedData);

      const { getByText, getByTestId } =
        await renderTestComponent(processDataMock);

      await getByTestId("process-file").click();

      await getByTestId("reset").click();

      const expectedState = {
        isInitial: true,
        isPending: false,
        error: null,
        isDone: false,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${expectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${expectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${expectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${expectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
        .toBeInTheDocument();
      expect(onResolveMock).toHaveBeenCalledTimes(1); // Called only during the first processFile
    });

    test("reset after sample data", async () => {
      const processDataMock = vi.fn().mockResolvedValue({} as ComputedData);

      const { getByText, getByTestId } =
        await renderTestComponent(processDataMock);

      await getByTestId("sample-data").click();

      await getByTestId("reset").click();

      const expectedState = {
        isInitial: true,
        isPending: false,
        error: null,
        isDone: false,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${expectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${expectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${expectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${expectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
        .toBeInTheDocument();
    });
  });

  test("sample data processing", async () => {
    const processDataMock = vi.fn().mockResolvedValue({} as ComputedData);

    const { getByText, getByTestId } =
      await renderTestComponent(processDataMock);

    await getByTestId("sample-data").click();

    const expectedState = {
      isInitial: false,
      isPending: false,
      error: null,
      isDone: true,
      isSampleData: true,
    };

    await expect
      .element(getByText(`Is Initial: ${expectedState.isInitial}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Pending: ${expectedState.isPending}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Error: ${expectedState.error}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Done: ${expectedState.isDone}`))
      .toBeInTheDocument();
    await expect
      .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
      .toBeInTheDocument();
    expect(onResolveMock).not.toHaveBeenCalled();
  });

  describe("pending state", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("before success", async () => {
      const processDataMock = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({} as ComputedData), 1000);
        });
      });

      const { getByText, getByTestId } =
        await renderTestComponent(processDataMock);

      await getByTestId("process-file").click();

      const expectedState = {
        isInitial: false,
        isPending: true,
        error: null,
        isDone: false,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${expectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${expectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${expectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${expectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
        .toBeInTheDocument();
      expect(onResolveMock).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      const completeExpectedState = {
        isInitial: false,
        isPending: false,
        error: null,
        isDone: true,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${completeExpectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${completeExpectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${completeExpectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${completeExpectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(
          getByText(`Is Sample Data: ${completeExpectedState.isSampleData}`),
        )
        .toBeInTheDocument();
      expect(onResolveMock).toHaveBeenCalledWith({} as ComputedData);
    });

    test("before error", async () => {
      const processDataMock = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Process error")), 1000);
        });
      });

      const { getByText, getByTestId } =
        await renderTestComponent(processDataMock);

      await getByTestId("process-file").click();

      const expectedState = {
        isInitial: false,
        isPending: true,
        error: null,
        isDone: false,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${expectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${expectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${expectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${expectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Sample Data: ${expectedState.isSampleData}`))
        .toBeInTheDocument();
      expect(onResolveMock).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      const completeExpectedState = {
        isInitial: false,
        isPending: false,
        error: "Process error",
        isDone: false,
        isSampleData: false,
      };

      await expect
        .element(getByText(`Is Initial: ${completeExpectedState.isInitial}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Pending: ${completeExpectedState.isPending}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Error: ${completeExpectedState.error}`))
        .toBeInTheDocument();
      await expect
        .element(getByText(`Is Done: ${completeExpectedState.isDone}`))
        .toBeInTheDocument();
      await expect
        .element(
          getByText(`Is Sample Data: ${completeExpectedState.isSampleData}`),
        )
        .toBeInTheDocument();
      expect(onResolveMock).not.toHaveBeenCalled();
    });
  });
});
