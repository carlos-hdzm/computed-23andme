import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import * as fileUploadContext from "../../context/FileUploadContext";
import AppContextProvider from "../../context/AppContext";
import FileError from "./FileError";

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

  test("should reset data on click", async () => {
    const { getByText } = await renderComponent();

    // Click Retry link
    await getByText("Retry").click();

    expect(resetMock).toHaveBeenCalled();
  });
});
