import { useContext } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import AppContextProvider from "../../context/AppContext";
import { AppDispatchContext } from "../../context/context";
import * as fileUploadContext from "../../context/FileUploadContext";
import contextActions from "../../context/actions";
import TopPanel from "./TopPanel";
import type { ComputedData } from "../../types";

vi.mock(import("../../context/FileUploadContext"), { spy: true });

const setMainPanelViewMock = vi.fn();

const TestComponentWithDispatch = ({
  data,
  mainPanelView = "regions",
}: {
  data?: ComputedData;
  mainPanelView?: "regions" | "chromosomes";
}) => {
  const dispatch = useContext(AppDispatchContext);

  const dispatchData = () => {
    if (data) {
      dispatch(contextActions.setData(data));
      dispatch(contextActions.setVersion("v7.0"));
      dispatch(contextActions.setConfidence("mostLikely"));
    }
  };

  return (
    <>
      <TopPanel
        mainPanelView={mainPanelView}
        setMainPanelView={setMainPanelViewMock}
      />
      <button data-testid="dispatch-btn" onClick={dispatchData} />
    </>
  );
};

const renderComponent = async (
  props: { data?: ComputedData; mainPanelView?: "regions" | "chromosomes" } = {
    mainPanelView: "regions",
  },
) => {
  return await render(
    <AppContextProvider>
      <TestComponentWithDispatch {...props} />
    </AppContextProvider>,
  );
};

const resetMock = vi.fn();
const data = {
  "v5.2": {
    50: {},
    60: {},
    70: {},
    80: {},
    90: {},
  },
  "v5.9": {
    50: {},
    60: {},
    70: {},
    80: {},
    90: {},
  },
  "v7.0": {
    50: {},
    60: {},
    70: {},
    80: {},
    90: {},
    mostLikely: {},
  },
} as ComputedData;

describe("TopPanel", () => {
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
    isDone?: boolean;
    isSampleData?: boolean;
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

  test("renders correctly on initial render (no data - no content)", async () => {
    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByTestId("action-panel")).not.toBeInTheDocument();
    await expect.element(getByText("Computed")).toBeInTheDocument();
    await expect.element(getByText("23andMe")).toBeInTheDocument();
  });

  test("renders correctly in error state (no content)", async () => {
    mockUseFileUploadState({ error: new Error("Data error") });
    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByTestId("action-panel")).not.toBeInTheDocument();
    await expect.element(getByText("Computed")).toBeInTheDocument();
    await expect.element(getByText("23andMe")).toBeInTheDocument();
  });

  describe("renders correctly with data", () => {
    test("sample data", async () => {
      mockUseFileUploadState({ isDone: true, isSampleData: true });
      const { getByTestId, getByText } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      await expect.element(getByTestId("action-panel")).toBeInTheDocument();
      await expect
        .element(getByText("You're viewing sample data."))
        .toBeInTheDocument();
      await expect.element(getByText("Reset")).toBeInTheDocument();
      await expect.element(getByTestId("version-select")).toBeInTheDocument();
      await expect
        .element(getByTestId("confidence-select"))
        .toBeInTheDocument();
      await expect.element(getByTestId("controls")).toHaveClass("active");
    });

    test("non-sample data", async () => {
      mockUseFileUploadState({ isDone: true });
      const { getByTestId, getByText } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      await expect.element(getByTestId("action-panel")).toBeInTheDocument();
      await expect
        .element(getByText("You're viewing your uploaded data."))
        .toBeInTheDocument();
      await expect.element(getByText("Reset")).toBeInTheDocument();
      await expect.element(getByTestId("version-select")).toBeInTheDocument();
      await expect
        .element(getByTestId("confidence-select"))
        .toBeInTheDocument();
      await expect.element(getByTestId("controls")).toHaveClass("active");
    });

    test("renders version options", async () => {
      mockUseFileUploadState({ isDone: true });
      const { getByTestId, getByText } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      await expect.element(getByText("Version 5.2")).toBeInTheDocument();
      await expect.element(getByText("Version 5.9")).toBeInTheDocument();
      await expect.element(getByText("Version 7.0")).toBeInTheDocument();
    });

    test("handles version change", async () => {
      mockUseFileUploadState({ isDone: true });
      const setVersionSpy = vi.spyOn(contextActions, "setVersion");
      const { getByTestId } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      // The dispatch sets the version to v7.0
      await expect.element(getByTestId("version-select")).toHaveValue("v7.0");

      await getByTestId("version-select").selectOptions("v5.2");
      await expect.element(getByTestId("version-select")).toHaveValue("v5.2");
      expect(setVersionSpy).toHaveBeenLastCalledWith("v5.2");

      await getByTestId("version-select").selectOptions("v5.9");
      await expect.element(getByTestId("version-select")).toHaveValue("v5.9");
      expect(setVersionSpy).toHaveBeenLastCalledWith("v5.9");

      await getByTestId("version-select").selectOptions("v7.0");
      await expect.element(getByTestId("version-select")).toHaveValue("v7.0");
      expect(setVersionSpy).toHaveBeenLastCalledWith("v7.0");
    });

    describe("renders confidence levels per version level", () => {
      test("v7.0 (after load)", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId, getByText } = await renderComponent({ data });

        // Load mock data
        await getByTestId("dispatch-btn").click();

        // The dispatch sets the version to v7.0, render the corresponding confidence levels
        await expect.element(getByText("Most Likely")).toBeInTheDocument();
        await expect.element(getByText("50% Confidence")).toBeInTheDocument();
        await expect.element(getByText("60% Confidence")).toBeInTheDocument();
        await expect.element(getByText("70% Confidence")).toBeInTheDocument();
        await expect.element(getByText("80% Confidence")).toBeInTheDocument();
        await expect.element(getByText("90% Confidence")).toBeInTheDocument();
      });

      test("v5.2", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId, getByText } = await renderComponent({ data });

        // Load mock data
        await getByTestId("dispatch-btn").click();

        await getByTestId("version-select").selectOptions("v5.2");
        // For v5.2, mostLikely is not an option
        await expect.element(getByText("Most Likely")).not.toBeInTheDocument();
        await expect.element(getByText("50% Confidence")).toBeInTheDocument();
        await expect.element(getByText("60% Confidence")).toBeInTheDocument();
        await expect.element(getByText("70% Confidence")).toBeInTheDocument();
        await expect.element(getByText("80% Confidence")).toBeInTheDocument();
        await expect.element(getByText("90% Confidence")).toBeInTheDocument();
      });

      test("v5.9", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId, getByText } = await renderComponent({ data });

        // Load mock data
        await getByTestId("dispatch-btn").click();

        await getByTestId("version-select").selectOptions("v5.9");
        // For v5.9, mostLikely is not an option
        await expect.element(getByText("Most Likely")).not.toBeInTheDocument();
        await expect.element(getByText("50% Confidence")).toBeInTheDocument();
        await expect.element(getByText("60% Confidence")).toBeInTheDocument();
        await expect.element(getByText("70% Confidence")).toBeInTheDocument();
        await expect.element(getByText("80% Confidence")).toBeInTheDocument();
        await expect.element(getByText("90% Confidence")).toBeInTheDocument();
      });

      test("v7.0 (from a different confidence level)", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId, getByText } = await renderComponent({ data });

        // Load mock data
        await getByTestId("dispatch-btn").click();

        await getByTestId("version-select").selectOptions("v5.9");

        await getByTestId("version-select").selectOptions("v7.0");
        // For v7.0, mostLikely is
        await expect.element(getByText("Most Likely")).toBeInTheDocument();
        await expect.element(getByText("50% Confidence")).toBeInTheDocument();
        await expect.element(getByText("60% Confidence")).toBeInTheDocument();
        await expect.element(getByText("70% Confidence")).toBeInTheDocument();
        await expect.element(getByText("80% Confidence")).toBeInTheDocument();
        await expect.element(getByText("90% Confidence")).toBeInTheDocument();
      });
    });

    test("handles confidence level change", async () => {
      mockUseFileUploadState({ isDone: true });
      const setConfidenceSpy = vi.spyOn(contextActions, "setConfidence");
      const { getByTestId } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      // The dispatch sets the confidence level to mostLikely
      await expect
        .element(getByTestId("confidence-select"))
        .toHaveValue("mostLikely");

      await getByTestId("confidence-select").selectOptions("50");
      await expect.element(getByTestId("confidence-select")).toHaveValue("50");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("50");

      await getByTestId("confidence-select").selectOptions("60");
      await expect.element(getByTestId("confidence-select")).toHaveValue("60");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("60");

      await getByTestId("confidence-select").selectOptions("70");
      await expect.element(getByTestId("confidence-select")).toHaveValue("70");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("70");

      await getByTestId("confidence-select").selectOptions("80");
      await expect.element(getByTestId("confidence-select")).toHaveValue("80");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("80");

      await getByTestId("confidence-select").selectOptions("90");
      await expect.element(getByTestId("confidence-select")).toHaveValue("90");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("90");

      await getByTestId("confidence-select").selectOptions("mostLikely");
      await expect
        .element(getByTestId("confidence-select"))
        .toHaveValue("mostLikely");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith("mostLikely");
    });

    test("handles interaction between version change confidence level change", async () => {
      mockUseFileUploadState({ isDone: true });
      const setConfidenceSpy = vi.spyOn(contextActions, "setConfidence");
      const { getByTestId } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      // The dispatch sets the version to v7.0
      await expect.element(getByTestId("version-select")).toHaveValue("v7.0");
      // The dispatch sets the confidence level to mostLikely
      await expect
        .element(getByTestId("confidence-select"))
        .toHaveValue("mostLikely");

      // Changing versions preserves confidence levels (except from v7.0:mostLikely to another version)
      // Going from v7.0 to v5.2 (or v5.9) sets the confidence level to 50, since they don't have mostLikely
      await getByTestId("version-select").selectOptions("v5.2");
      await expect.element(getByTestId("confidence-select")).toHaveValue("50");
      expect(setConfidenceSpy).toHaveBeenLastCalledWith(50);
      setConfidenceSpy.mockClear();

      await getByTestId("version-select").selectOptions("v5.9");
      await expect.element(getByTestId("confidence-select")).toHaveValue("50");
      // No confidence change happens
      expect(setConfidenceSpy).not.toHaveBeenCalled();

      await getByTestId("confidence-select").selectOptions("70");
      setConfidenceSpy.mockClear();

      await getByTestId("version-select").selectOptions("v7.0");
      await expect.element(getByTestId("confidence-select")).toHaveValue("70");
      expect(setConfidenceSpy).not.toHaveBeenCalled();

      await getByTestId("confidence-select").selectOptions("90");
      setConfidenceSpy.mockClear();

      await getByTestId("version-select").selectOptions("v5.9");
      await expect.element(getByTestId("confidence-select")).toHaveValue("90");
      expect(setConfidenceSpy).not.toHaveBeenCalled();
    });
  });

  test("handles reset", async () => {
    mockUseFileUploadState({ isDone: true });
    const clearDataSpy = vi.spyOn(contextActions, "clearData");
    const { getByTestId, getByText } = await renderComponent({ data });

    // Load mock data
    await getByTestId("dispatch-btn").click();

    // Delete data
    await getByText("Reset").click();

    expect(resetMock).toHaveBeenCalled();
    expect(clearDataSpy).toHaveBeenCalled();
  });

  describe("handles MainView toggle", () => {
    beforeEach(() => {
      setMainPanelViewMock.mockClear();
    });

    describe("renders button on mobile", () => {
      test("starting with regions", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId } = await renderComponent({ data });

        // Load mock data
        await getByTestId("dispatch-btn").click();
        
        const toggle = getByTestId("main-view-toggle");
        await expect.element(toggle).toHaveAccessibleName("Toggle Main View, currently displaying regions panel.");
        await expect.element(getByTestId("main-view-status")).toBeEmptyDOMElement();

        await expect
          .element(toggle)
          .toBeInTheDocument();
        await toggle.click();
        expect(setMainPanelViewMock).toHaveBeenCalledWith("chromosomes");
        // Assert accessibility actions
        await expect.element(toggle).toHaveAccessibleName("Toggle Main View, currently displaying chromosomes panel.");
        await expect.element(getByTestId("main-view-status")).toHaveTextContent("Now displaying chromosomes panel.");
      });

      test("starting with chromosomes", async () => {
        mockUseFileUploadState({ isDone: true });
        const { getByTestId } = await renderComponent({ data, mainPanelView: "chromosomes" });

        // Load mock data
        await getByTestId("dispatch-btn").click();
        
        const toggle = getByTestId("main-view-toggle");
        await expect.element(toggle).toHaveAccessibleName("Toggle Main View, currently displaying chromosomes panel.");
        await expect.element(getByTestId("main-view-status")).toBeEmptyDOMElement();

        await expect
          .element(toggle)
          .toBeInTheDocument();
        await toggle.click();
        expect(setMainPanelViewMock).toHaveBeenCalledWith("regions");
        // Assert accessibility actions
        await expect.element(toggle).toHaveAccessibleName("Toggle Main View, currently displaying regions panel.");
        await expect.element(getByTestId("main-view-status")).toHaveTextContent("Now displaying regions panel.");
      });
    });

    test("does not render button on desktop", async () => {
      await page.viewport(1080, 800);
      mockUseFileUploadState({ isDone: true });
      const { getByTestId } = await renderComponent({ data });

      // Load mock data
      await getByTestId("dispatch-btn").click();

      await expect
        .element(getByTestId("main-view-toggle"))
        .not.toBeInTheDocument();
    });
  });
});
