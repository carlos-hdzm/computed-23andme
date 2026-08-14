import { useContext, useEffect } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import RegionRow, { type RegionRowProps } from "./RegionRow";
import AppContextProvider from "../../context/AppContext";
import { AppContext } from "../../context/context";
import type { SortedRegionDataEntry } from "../../types";
import contextActions from "../../context/actions";

vi.mock(
  import("../../styles/regions.module.less"),
  () =>
    ({
      default: {
        class1: "class1",
        "class1-1": "class1-1",
        "class1-2": "class1-2",
        "class1-3": "class1-3",
      },
    }) as unknown as typeof import("../../styles/regions.module.less"),
);

const highlightContextCheckMock = vi.fn((highlight: string) => highlight);

const renderComponent = async (props: RegionRowProps) => {
  return await render(
    <AppContextProvider>
      <table>
        <tbody>
          <RegionRow {...props} />
        </tbody>
      </table>
    </AppContextProvider>,
  );
};

const TestComponentWithDispatch = (props: RegionRowProps) => {
  const { highlight } = useContext(AppContext);

  useEffect(() => {
    highlightContextCheckMock(highlight);
  }, [highlight]);

  return (
    <table>
      <tbody>
        <RegionRow {...props} />
      </tbody>
    </table>
  );
};

const renderComponentWithDispatch = async (props: RegionRowProps) => {
  return await render(
    <AppContextProvider>
      <TestComponentWithDispatch {...props} />
    </AppContextProvider>,
  );
};

describe("RegionRow component", () => {
  beforeEach(() => {
    highlightContextCheckMock.mockClear();
  });

  const regionEntry = {
    label: "Region 1",
    cssClass: "region-1",
    total: {
      proportion: 1,
    },
    depth: 1,
    subregions: [
      [
        "region-1-1",
        {
          label: "Region 1.1",
          cssClass: "region-1-1",
          total: {
            proportion: 0.6,
          },
          depth: 2,
          subregions: [
            [
              "region-1-1-1",
              {
                label: "Region 1.1.1",
                cssClass: "region-1-1-1",
                total: {
                  proportion: 0.45255,
                },
                depth: 3,
              },
            ],
            [
              "region-1-1-2",
              {
                label: "Region 1.1.2",
                cssClass: "region-1-1-2",
                total: {
                  proportion: 0.14745,
                },
                depth: 3,
              },
            ],
          ],
        },
      ],
      [
        "region-1-2",
        {
          label: "Region 1.2",
          cssClass: "region-1-2",
          total: {
            proportion: 0.35,
          },
          depth: 2,
          subregions: [
            [
              "region-1-2-1",
              {
                label: "Region 1.2.1",
                cssClass: "region-1-2-1",
                total: {
                  proportion: 0.25,
                },
                depth: 3,
              },
            ],
            [
              "region-1-2-2",
              {
                label: "Region 1.2.2",
                cssClass: "region-1-2-2",
                total: {
                  proportion: 0.07777777,
                },
                depth: 3,
              },
            ],
            [
              "region-1-2-3",
              {
                label: "Region 1.2.3",
                cssClass: "region-1-2-3",
                total: {
                  proportion: 0.02222223,
                },
                depth: 3,
              },
            ],
          ],
        },
      ],
      [
        "region-1-3",
        {
          label: "Region 1.3",
          cssClass: "region-1-3",
          total: {
            proportion: 0.05,
          },
          depth: 2,
        },
      ],
    ],
  } as unknown as SortedRegionDataEntry;

  test("renders correctly with given region entry", async () => {
    const { container, getByText } = await renderComponent({ regionEntry });

    expect(container).toMatchSnapshot();
    // Ensure that percentages are rounded to two decimal places
    await expect.element(getByText("60.00%")).toBeInTheDocument();
    await expect.element(getByText(/^5\.00%/)).toBeInTheDocument();
    await expect.element(getByText("45.26%")).toBeInTheDocument();
    await expect.element(getByText("7.78%")).toBeInTheDocument();
  });

  test("changes highlight context on mouse over and mouse out", async () => {
    const setHighlightSpy = vi.spyOn(contextActions, "setHighlight");
    const { getByText } = await renderComponentWithDispatch({
      regionEntry,
    });

    // Hover on row "Region 1.1"
    await getByText(/Region 1\.1$/).hover();
    // Check that the highlight context was updated
    expect(highlightContextCheckMock).toHaveBeenLastCalledWith("region-1-1");
    expect(setHighlightSpy).toHaveBeenLastCalledWith("region-1-1");

    // Mouse out
    await getByText(/Region 1\.1$/).unhover();
    // Check that the highlight context was updated
    expect(highlightContextCheckMock).toHaveBeenLastCalledWith("");
    expect(setHighlightSpy).toHaveBeenLastCalledWith("");

    // Hover on row "Region 1.2.2"
    await getByText("Region 1.2.2").hover();
    // Check that the highlight context was updated
    expect(highlightContextCheckMock).toHaveBeenLastCalledWith("region-1-2-2");
    expect(setHighlightSpy).toHaveBeenLastCalledWith("region-1-2-2");

    // Mouse out
    await getByText("Region 1.2.2").unhover();
    // Check that the highlight context was updated
    expect(highlightContextCheckMock).toHaveBeenLastCalledWith("");
    expect(setHighlightSpy).toHaveBeenLastCalledWith("");
  });
});
