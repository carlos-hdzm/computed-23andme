import { useContext } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import AppContextProvider from "../../context/AppContext";
import { AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";
import type { ChromosomePairProps } from "../ChromosomePair/ChromosomePair";
import type { ComputedData } from "../../types";
import ChromosomeViewer from "./ChromosomeViewer";

const mockData = {
  "v5.2": {
    50: {
      chromosomes: {
        autosomal: [
          ["chr1-hap1-1", "chr1-hap2-1"],
          ["chr2-hap1-1", "chr2-hap2-1"],
          ["chr3-hap1-1", "chr3-hap2-1"],
        ],
        sex: ["chrX-hap1-1"],
      },
    },
  },
  "v5.9": {
    70: {
      chromosomes: {
        autosomal: [
          ["chr1-hap1-2", "chr1-hap2-2"],
          ["chr2-hap1-2", "chr2-hap2-2"],
        ],
        sex: ["chrX-hap1-2", "chrX-hap2-2"],
      },
    },
  },
  "v7.0": {
    mostLikely: {
      chromosomes: {
        autosomal: [
          ["chr1-hap1-3", "chr1-hap2-3"],
          ["chr2-hap1-3", "chr2-hap2-3"],
          ["chr3-hap1-3", "chr3-hap2-3"],
          ["chr4-hap1-3", "chr4-hap2-3"],
        ],
        sex: ["chrX-hap1-3"],
      },
    },
  },
} as unknown as ComputedData;

const chromosomePairMockFn = vi.fn(
  ({ pair, isSexPair, label }: ChromosomePairProps) => {
    return { pair, isSexPair, label };
  },
);

vi.mock(import("../ChromosomePair/ChromosomePair"), () => ({
  default: (props: ChromosomePairProps) => {
    chromosomePairMockFn(props);
    return (
      <tr>
        <td>ChromosomePair</td>
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
      <ChromosomeViewer />
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
    chromosomePairMockFn.mockClear();
  });

  test("should render correctly with initial state", async () => {
    const { getByText } = await renderComponent();

    // On initial render, with initial state, data, confidence, and version are empty, so no ChromosomePairs are rendered.
    await expect.element(getByText("ChromosomePair")).not.toBeInTheDocument();
  });

  describe("should handle panelHidden prop", () => {
    test("when panelHidden = false (default)", async () => {
      const { getByTestId } = await render(<ChromosomeViewer />);

      await expect.element(getByTestId("chromosome-viewer-panel")).toHaveClass("chromosome-viewer", { exact: true });
    });

    test("when panelHidden = true", async () => {
      const { getByTestId } = await render(<ChromosomeViewer panelHidden={true} />);

      await expect.element(getByTestId("chromosome-viewer-panel")).toHaveClass("chromosome-viewer", "panel-hidden", { exact: true });
    });
  });

  describe("should handle context change", () => {
    test("case 1: genetic male", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-1").click();

      // 4 ChromosomePairs should be rendered: 3 autosomal and 1 sex
      await expect.poll(() => getByText("ChromosomePair")).toHaveLength(4);
      expect(chromosomePairMockFn).toHaveBeenCalledTimes(4);
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(1, {
        pair: ["chr1-hap1-1", "chr1-hap2-1"],
        isSexPair: false,
        label: 1,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(2, {
        pair: ["chr2-hap1-1", "chr2-hap2-1"],
        isSexPair: false,
        label: 2,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(3, {
        pair: ["chr3-hap1-1", "chr3-hap2-1"],
        isSexPair: false,
        label: 3,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(4, {
        pair: ["chrX-hap1-1"],
        isSexPair: true,
      });
    });

    test("case 2: genetic female", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-2").click();

      // 3 ChromosomePairs should be rendered: 2 autosomal and 1 sex
      await expect.poll(() => getByText("ChromosomePair")).toHaveLength(3);
      expect(chromosomePairMockFn).toHaveBeenCalledTimes(3);
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(1, {
        pair: ["chr1-hap1-2", "chr1-hap2-2"],
        isSexPair: false,
        label: 1,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(2, {
        pair: ["chr2-hap1-2", "chr2-hap2-2"],
        isSexPair: false,
        label: 2,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(3, {
        pair: ["chrX-hap1-2", "chrX-hap2-2"],
        isSexPair: true,
      });
    });

    test("case 3: mostLikely confidence level", async () => {
      const { getByText, getByTestId } = await renderComponent();

      // Populate context data
      await getByTestId("dispatch-3").click();

      // 5 ChromosomePairs should be rendered: 2 autosomal and 1 sex
      await expect.poll(() => getByText("ChromosomePair")).toHaveLength(5);
      expect(chromosomePairMockFn).toHaveBeenCalledTimes(5);
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(1, {
        pair: ["chr1-hap1-3", "chr1-hap2-3"],
        isSexPair: false,
        label: 1,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(2, {
        pair: ["chr2-hap1-3", "chr2-hap2-3"],
        isSexPair: false,
        label: 2,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(3, {
        pair: ["chr3-hap1-3", "chr3-hap2-3"],
        isSexPair: false,
        label: 3,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(4, {
        pair: ["chr4-hap1-3", "chr4-hap2-3"],
        isSexPair: false,
        label: 4,
      });
      expect(chromosomePairMockFn).toHaveBeenNthCalledWith(5, {
        pair: ["chrX-hap1-3"],
        isSexPair: true,
      });
    });
  });
});
