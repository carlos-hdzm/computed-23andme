import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import * as fileUploadContext from "../../context/FileUploadContext";
import AppContextProvider from "../../context/AppContext";
import FileError from "./FileError";
import { FILE_TOO_LARGE_ERROR_CAUSE, MAX_FILE_SIZE_MB } from "../../constants/fileProcessing";

vi.mock(import("../../context/FileUploadContext"), { spy: true });

const renderComponent = async () => {
  return await render(
    <AppContextProvider>
      <FileError />
    </AppContextProvider>,
  );
};

const resetMock = vi.fn();

describe("FileError", () => {
  const useFileUploadInitialValue = {
    processFile: vi.fn(),
    reset: resetMock,
    setUsingSampleData: vi.fn(),
    state: {
      isInitial: true,
      isPending: false,
      error: null,
      isDone: false,
      isSampleData: false,
    },
  };
  const useFileUploadSpy = vi.mocked(fileUploadContext.useFileUpload);
  useFileUploadSpy.mockReturnValue(useFileUploadInitialValue);

  const mockUseFileUploadState = (targetState: {
    error?: Error | null;
  }) =>
    useFileUploadSpy.mockReturnValue({
      ...useFileUploadInitialValue,
      state: {
        ...useFileUploadInitialValue.state,
        ...targetState,
      },
    });

  beforeEach(() => {
    useFileUploadSpy.mockClear();
    resetMock.mockClear();
  });

  test("should render correctly on initial render", async () => {
    const { getByText } = await renderComponent();

    await expect
      .element(
        getByText(
          "Error processing file. Please try again or use sample data.",
        ),
      )
      .toBeInTheDocument();
    await expect.element(getByText("Retry")).toBeInTheDocument();
  });

  test("file size error message is displayed", async () => {
    mockUseFileUploadState({
      error: new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`, { cause: FILE_TOO_LARGE_ERROR_CAUSE }),
    });
    const { getByText } = await renderComponent();

    await expect
      .element(
        getByText(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB. Please try again with a smaller file or use sample data.`,
        ),
      )
      .toBeInTheDocument();
    await expect.element(getByText("Retry")).toBeInTheDocument();
  });

  test("should reset data on click", async () => {
    const { getByText } = await renderComponent();

    // Click Retry link
    await getByText("Retry").click();

    expect(resetMock).toHaveBeenCalled();
  });
});
