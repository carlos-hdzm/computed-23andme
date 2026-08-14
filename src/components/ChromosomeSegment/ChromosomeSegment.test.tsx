import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import ChromosomeSegment, {
  type ChromosomeSegmentProps,
} from "./ChromosomeSegment";
import AppContextProvider from "../../context/AppContext";
import { AppDispatchContext } from "../../context/context";
import type { ChromosomeSegment as ChromosomeSegmentType } from "../../types";
import contextActions from "../../context/actions";
import { useContext } from "react";

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

const renderComponent = async (props: ChromosomeSegmentProps) => {
  return await render(
    <AppContextProvider>
      <ChromosomeSegment {...props} />
    </AppContextProvider>,
  );
};

const TestComponentWithDispatch = (props: ChromosomeSegmentProps) => {
  const dispatch = useContext(AppDispatchContext);

  const dispatchHighlight = () => {
    dispatch(contextActions.setHighlight("class1-1"));
  };

  return (
    <>
      <ChromosomeSegment {...props} />
      <button data-testid="dispatch-highlight" onClick={dispatchHighlight} />
    </>
  );
};

const renderComponentWithDispatch = async (props: ChromosomeSegmentProps) => {
  return await render(
    <AppContextProvider>
      <TestComponentWithDispatch {...props} />
    </AppContextProvider>,
  );
};

describe("ChromosomeSegment component", () => {
  test("renders correctly with given chromosome data", async () => {
    const chromosomeData = {
      start: 0,
      end: 100,
      region: "region1",
      cssClass: "class1",
      depth: 1,
      subsegments: [
        {
          start: 0,
          end: 50,
          region: "region1-1",
          cssClass: "class1-1",
          depth: 2,
          subsegments: [
            {
              start: 0,
              end: 40,
              region: "region1-1-1",
              cssClass: "class1-1-1",
              depth: 3,
            },
            {
              start: 40,
              end: 50,
              region: "region1-1-2",
              cssClass: "class1-1-2",
              depth: 3,
            },
          ],
        },
        {
          start: 50,
          end: 80,
          region: "region1-2",
          cssClass: "class1-2",
          depth: 2,
        },
        {
          start: 80,
          end: 100,
          region: "region1-3",
          cssClass: "class1-3",
          depth: 2,
          subsegments: [
            {
              start: 80,
              end: 90,
              region: "region1-3-1",
              cssClass: "class1-3-1",
              depth: 3,
            },
            {
              start: 90,
              end: 95,
              region: "region1-3-2",
              cssClass: "class1-3-2",
              depth: 3,
            },
            {
              start: 95,
              end: 100,
              region: "region1-3-3",
              cssClass: "class1-3-3",
              depth: 3,
              subsegments: [
                {
                  start: 95,
                  end: 100,
                  region: "region1-3-3-1",
                  cssClass: "class1-3-3-1",
                  depth: 4,
                },
              ],
            },
          ],
        },
      ],
    } as ChromosomeSegmentType;

    const { container } = await renderComponent({
      segment: chromosomeData,
      parentLength: 100,
    });

    expect(container).toMatchSnapshot();
  });

  test("renders correctly with given chromosome data and highlighted CSS class", async () => {
    const chromosomeData = {
      start: 0,
      end: 100,
      region: "region1",
      cssClass: "class1",
      depth: 1,
      subsegments: [
        {
          start: 0,
          end: 50,
          region: "region1-1",
          cssClass: "class1-1",
          depth: 2,
        },
        {
          start: 50,
          end: 80,
          region: "region1-2",
          cssClass: "class1-2",
          depth: 2,
        },
        {
          start: 80,
          end: 100,
          region: "region1-3",
          cssClass: "class1-3",
          depth: 2,
        },
      ],
    } as ChromosomeSegmentType;

    const { container, getByTestId, getByClassName } =
      await renderComponentWithDispatch({
        segment: chromosomeData,
        parentLength: 100,
      });

    await getByTestId("dispatch-highlight").click();

    await expect.element(getByClassName("class1")).toHaveClass("dimmed");
    await expect.element(getByClassName("class1-1")).toHaveClass("highlight");
    await expect.element(getByClassName("class1-2")).toHaveClass("dimmed");
    await expect.element(getByClassName("class1-3")).toHaveClass("dimmed");
    expect(container).toMatchSnapshot();
  });
});
