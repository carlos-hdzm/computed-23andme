import { useContext } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import AppContextProvider from "../../context/AppContext";
import { AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";
import type { RegionRowProps } from "../RegionRow/RegionRow";
import type { ComputedData } from "../../types";
import Proportions from "./Proportions";

const mockData = {
  "v5.2": {
    50: {
      regions: [
        ["region-1-1", "region-1-entry-1"],
        ["region-2-1", "region-2-entry-1"],
        ["region-3-1", "region-3-entry-1"],
      ],
    },
  },
  "v5.9": {
    70: {
      regions: [
        ["region-1-2", "region-1-entry-2"],
        ["region-2-2", "region-2-entry-2"],
      ],
    },
  },
  "v7.0": {
    mostLikely: {
      regions: [
        ["region-1-3", "region-1-entry-3"],
        ["region-2-3", "region-2-entry-3"],
        ["region-3-3", "region-3-entry-3"],
        ["region-4-3", "region-4-entry-3"],
      ],
    },
  },
} as unknown as ComputedData;

const regionRowMockFn = vi.fn(({ regionName, regionEntry }: RegionRowProps) => {
  return { regionName, regionEntry };
});

vi.mock(import("../RegionRow/RegionRow"), () => ({
  default: (props: RegionRowProps) => {
    regionRowMockFn(props);
    return (
      <tr>
        <td>RegionRow</td>
      </tr>
    );
  },
}));

const TestComponentWithDispatch = () => {
  const dispatch = useContext(AppDispatchContext);

  const dispatch1 = () => {
    dispatch(contextActions.setData(mockData));
    dispatch(contextActions.setVersion("v5.2"));
    dispatch(contextActions.setConfidence(50));
  };

  const dispatch2 = () => {
    dispatch(contextActions.setData(mockData));
    dispatch(contextActions.setVersion("v5.9"));
    dispatch(contextActions.setConfidence(70));
  };

  const dispatch3 = () => {
    dispatch(contextActions.setData(mockData));
    dispatch(contextActions.setVersion("v7.0"));
    dispatch(contextActions.setConfidence("mostLikely"));
  };

  return (
    <>
      <Proportions />
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

describe("ChromosomeViewer", () => {
  beforeEach(() => {
    regionRowMockFn.mockClear();
  });

  test("should render correctly with initial state", async () => {
    const { getByText } = await renderComponent();

    // The table header should always be rendered
    await expect.element(getByText("World")).toBeInTheDocument();
    await expect.element(getByText("100%")).toBeInTheDocument();
    // On initial render, with initial state, data, confidence, and version are empty, so no RegionRows are rendered.
    await expect.element(getByText("RegionRow")).not.toBeInTheDocument();
  });

  describe("should handle context change", () => {
    test("case 1: v5.2, 50% confidence level", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-1").click();

      // 3 RegionRows should be rendered
      await expect.poll(() => getByText("RegionRow")).toHaveLength(3);
      expect(regionRowMockFn).toHaveBeenCalledTimes(3);
      expect(regionRowMockFn).toHaveBeenNthCalledWith(1, {
        regionName: "region-1-1",
        regionEntry: "region-1-entry-1",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(2, {
        regionName: "region-2-1",
        regionEntry: "region-2-entry-1",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(3, {
        regionName: "region-3-1",
        regionEntry: "region-3-entry-1",
      });
    });

    test("case 2: v5.9, 70% confidence level", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-2").click();

      // 2 RegionRows should be rendered
      await expect.poll(() => getByText("RegionRow")).toHaveLength(2);
      expect(regionRowMockFn).toHaveBeenCalledTimes(2);
      expect(regionRowMockFn).toHaveBeenNthCalledWith(1, {
        regionName: "region-1-2",
        regionEntry: "region-1-entry-2",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(2, {
        regionName: "region-2-2",
        regionEntry: "region-2-entry-2",
      });
    });

    test("case 3: v7.0, mostLikely confidence level", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-3").click();

      // 4 RegionRows should be rendered
      await expect.poll(() => getByText("RegionRow")).toHaveLength(4);
      expect(regionRowMockFn).toHaveBeenCalledTimes(4);
      expect(regionRowMockFn).toHaveBeenNthCalledWith(1, {
        regionName: "region-1-3",
        regionEntry: "region-1-entry-3",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(2, {
        regionName: "region-2-3",
        regionEntry: "region-2-entry-3",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(3, {
        regionName: "region-3-3",
        regionEntry: "region-3-entry-3",
      });
      expect(regionRowMockFn).toHaveBeenNthCalledWith(4, {
        regionName: "region-4-3",
        regionEntry: "region-4-entry-3",
      });
    });
  });
});
