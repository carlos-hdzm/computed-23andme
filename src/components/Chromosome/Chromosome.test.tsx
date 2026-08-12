import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import Chromosome, { type ChromosomeProps } from "./Chromosome";
import type {
  ChromosomeHaplotypeSplit,
  ChromosomeLengthObject,
  ChromosomeSegment,
} from "../../types";
import type { ChromosomeSegmentProps } from "../ChromosomeSegment/ChromosomeSegment";

vi.mock(import("../../../assets/json/chromosomes.json"), () => ({
  default: {
    1: {
      length: 100,
      centromere: [25, 35],
    },
    "chrX-npar": {
      length: 80,
      centromere: [20, 30],
    },
    "chrY-npar": {
      length: 50,
      centromere: [15, 25],
    },
  } as ChromosomeLengthObject,
}));

const chromosomeSegmentMockFn = vi.fn(
  ({ segment, parentLength }: ChromosomeSegmentProps) => {
    return { segment, parentLength };
  },
);

vi.mock(import("../ChromosomeSegment/ChromosomeSegment"), () => ({
  default: ({ segment, parentLength }: ChromosomeSegmentProps) => {
    chromosomeSegmentMockFn({ segment, parentLength });
    return <div>Segment</div>;
  },
}));

const renderComponent = async (props: ChromosomeProps) => {
  return await render(<Chromosome {...props} />);
};

describe("Chromosome component", () => {
  beforeEach(() => {
    chromosomeSegmentMockFn.mockClear();
  });

  describe("autosomal chromosome", () => {
    test("renders correctly with given chromosome data", async () => {
      const chromosomeData = [
        [{ start: 0, end: 30 }],
        [
          { start: 30, end: 70 },
          { start: 70, end: 100 },
        ],
      ] as ChromosomeHaplotypeSplit;

      const { getByText } = await renderComponent({
        chromosome: chromosomeData,
        label: 1,
      });

      await expect.poll(() => getByText("Segment")).toHaveLength(3);
      expect(chromosomeSegmentMockFn).toHaveBeenCalledTimes(3);
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(1, {
        segment: { start: 0, end: 30 },
        parentLength: 30,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(2, {
        segment: { start: 30, end: 70 },
        parentLength: 70,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(3, {
        segment: { start: 70, end: 100 },
        parentLength: 70,
      });
    });

    test("renders correctly with given chromosome data - start after centromere", async () => {
      const chromosomeData = [
        [] as ChromosomeSegment[],
        [
          { start: 40, end: 50 },
          { start: 50, end: 70 },
          { start: 70, end: 100 },
        ],
      ] as ChromosomeHaplotypeSplit;

      const { getByText } = await renderComponent({
        chromosome: chromosomeData,
        label: 1,
      });

      await expect.poll(() => getByText("Segment")).toHaveLength(3);
      expect(chromosomeSegmentMockFn).toHaveBeenCalledTimes(3);
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(1, {
        segment: { start: 40, end: 50 },
        parentLength: 60,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(2, {
        segment: { start: 50, end: 70 },
        parentLength: 60,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(3, {
        segment: { start: 70, end: 100 },
        parentLength: 60,
      });
    });
  });

  describe("X chromosome", () => {
    test("renders correctly with given chromosome data", async () => {
      const chromosomeData = [
        [{ start: 10, end: 25 }],
        [
          { start: 25, end: 70 },
          { start: 70, end: 80 },
        ],
      ] as ChromosomeHaplotypeSplit;

      const { getByText } = await renderComponent({
        chromosome: chromosomeData,
        label: "X",
      });

      await expect.poll(() => getByText("Segment")).toHaveLength(3);
      expect(chromosomeSegmentMockFn).toHaveBeenCalledTimes(3);
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(1, {
        segment: { start: 10, end: 25 },
        parentLength: 15,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(2, {
        segment: { start: 25, end: 70 },
        parentLength: 55,
      });
      expect(chromosomeSegmentMockFn).toHaveBeenNthCalledWith(3, {
        segment: { start: 70, end: 80 },
        parentLength: 55,
      });
    });
  });

  describe("Y chromosome", () => {
    test("renders correctly with given chromosome data", async () => {
      const { getByText } = await renderComponent({ label: "Y" });

      await expect.element(getByText("Segment")).not.toBeInTheDocument();
      expect(chromosomeSegmentMockFn).not.toHaveBeenCalled();
    });
  });
});
