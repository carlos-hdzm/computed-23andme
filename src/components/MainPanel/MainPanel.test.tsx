import { useContext } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import AppContextProvider from "../../context/AppContext";
import { AppDispatchContext } from "../../context/context";
import * as fileUploadContext from "../../context/FileUploadContext";
import contextActions from "../../context/actions";
import MainPanel from "./MainPanel";

vi.mock(
  import("../../styles/regions.module.less"),
  () =>
    ({
      default: {
        v5_2: "v5_2",
        v5_9: "v5_9",
        v7_0: "v7_0",
      },
    }) as unknown as typeof import("../../styles/regions.module.less"),
);

vi.mock(import("../ChromosomeViewer/ChromosomeViewer"), () => ({
  default: () => <p>ChromosomeViewer</p>,
}));

vi.mock(import("../Proportions/Proportions"), () => ({
  default: () => <p>Proportions</p>,
}));

vi.mock(import("../FileSelector/FileSelector"), () => ({
  default: () => <p>FileSelector</p>,
}));

vi.mock(import("../SampleData/SampleData"), () => ({
  default: () => <p>SampleData</p>,
}));

vi.mock(import("../../context/FileUploadContext"), { spy: true });

const TestComponentWithDispatch = () => {
  const dispatch = useContext(AppDispatchContext);

  const dispatch1 = () => {
    dispatch(contextActions.setVersion("v5.2"));
  };

  const dispatch2 = () => {
    dispatch(contextActions.setVersion("v5.9"));
  };

  const dispatch3 = () => {
    dispatch(contextActions.setVersion("v7.0"));
  };

  return (
    <>
      <MainPanel />
      <button data-testid="dispatch-1" onClick={dispatch1} />
      <button data-testid="dispatch-2" onClick={dispatch2} />
      <button data-testid="dispatch-3" onClick={dispatch3} />
    </>
  );
};

const renderComponent = async () => {
  return await render(
    <AppContextProvider>
      <TestComponentWithDispatch />
    </AppContextProvider>,
  );
};

describe("MainPanel", () => {
  const useFileUploadInitialValue = {
    processFile: vi.fn(),
    reset: vi.fn(),
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
    isInitial?: boolean;
    isPending?: boolean;
    error?: Error | null;
    isDone?: boolean;
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
  });

  test("renders FileSelector and SampleData correctly on initial render", async () => {
    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByText("FileSelector")).toBeInTheDocument();
    await expect.element(getByText("SampleData")).toBeInTheDocument();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "initial-panel", { exact: true });
  });

  test("adds pending-panel class when in pending state", async () => {
    mockUseFileUploadState({
      isInitial: false,
      isPending: true,
    });

    const { getByTestId } = await renderComponent();

    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "pending-panel", { exact: true });
  });

  test("renders error message and SampleData on error", async () => {
    mockUseFileUploadState({
      isInitial: false,
      error: new Error("Data error"),
    });

    const { getByText, getByTestId } = await renderComponent();

    await expect
      .element(getByText("Error processing file: Data error"))
      .toBeInTheDocument();
    await expect.element(getByText("SampleData")).toBeInTheDocument();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "error-panel", { exact: true });
  });

  test("renders Proportions and ChromosomeViewer when done", async () => {
    mockUseFileUploadState({
      isInitial: false,
      isDone: true,
    });

    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByText("Proportions")).toBeInTheDocument();
    await expect.element(getByText("ChromosomeViewer")).toBeInTheDocument();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", { exact: true });
  });

  test("in done state, version context change changes CSS class", async () => {
    mockUseFileUploadState({
      isInitial: false,
      isDone: true,
    });

    const { getByTestId } = await renderComponent();

    // Change version to v5.2
    await getByTestId("dispatch-1").click();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "v5_2", { exact: true });

    // Change version to v5.9
    await getByTestId("dispatch-2").click();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "v5_9", { exact: true });

    // Change version to v7.0
    await getByTestId("dispatch-3").click();
    await expect
      .element(getByTestId("main-panel"))
      .toHaveClass("main-panel", "v7_0", { exact: true });
  });
});
