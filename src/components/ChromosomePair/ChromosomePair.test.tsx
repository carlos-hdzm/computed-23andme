import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import ChromosomePair, { type ChromosomePairProps } from "./ChromosomePair";
import type { ChromosomeHaplotypeSplit } from "../../types";
import type { ChromosomeProps } from "../Chromosome/Chromosome";

const chromosomeMockFn = vi.fn(({ chromosome, label }: ChromosomeProps) => {
  return { chromosome, label };
});

vi.mock(import("../Chromosome/Chromosome"), () => ({
  default: ({ chromosome, label }: ChromosomeProps) => {
    chromosomeMockFn({ chromosome, label });
    return <div>Chromosome</div>;
  },
}));

const renderComponent = async (props: ChromosomePairProps) => {
  return await render(<ChromosomePair {...props} />);
};

describe("Chromosome component", () => {
  beforeEach(() => {
    chromosomeMockFn.mockClear();
  });

  describe("autosomal chromosome pair", () => {
    test("renders correctly with given chromosome data", async () => {
      const chromosomeData = ["chr1 - hap1", "chr1 - hap2"] as unknown as [
        ChromosomeHaplotypeSplit,
        ChromosomeHaplotypeSplit,
      ];

      const { getByText } = await renderComponent({
        label: 1,
        isSexPair: false,
        pair: chromosomeData,
      });

      await expect.poll(() => getByText("Chromosome")).toHaveLength(2);
      // The chromosome index label should only be rendered once
      await expect.poll(() => getByText("1")).toHaveLength(1);
      expect(chromosomeMockFn).toHaveBeenCalledTimes(2);
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(1, {
        chromosome: "chr1 - hap1",
        label: 1,
      });
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(2, {
        chromosome: "chr1 - hap2",
        label: 1,
      });
    });
  });

  describe("sex chromosome pair", () => {
    test("two X chromosomes (genetic female)", async () => {
      const chromosomeData = ["chrX - hap1", "chrX - hap2"] as unknown as [
        ChromosomeHaplotypeSplit,
        ChromosomeHaplotypeSplit,
      ];

      const { getByText } = await renderComponent({
          isSexPair: true,
          pair: chromosomeData,
      });

      await expect.poll(() => getByText("Chromosome")).toHaveLength(2);
      // The X label should only be rendered once, and no Y label
      await expect.poll(() => getByText("X")).toHaveLength(1);
      await expect.element(getByText("Y")).not.toBeInTheDocument();
      expect(chromosomeMockFn).toHaveBeenCalledTimes(2);
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(1, {
        chromosome: "chrX - hap1",
        label: "X",
      });
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(2, {
        chromosome: "chrX - hap2",
        label: "X",
      });
    });

    test("one X chromosome and one Y chromosome (genetic male)", async () => {
      const chromosomeData = ["chrX"] as unknown as [
        ChromosomeHaplotypeSplit,
        ChromosomeHaplotypeSplit,
      ];

      const { getByText } = await renderComponent({
          isSexPair: true,
          pair: chromosomeData,
      });

      await expect.poll(() => getByText("Chromosome")).toHaveLength(2);
      // Both X and Y labels should be rendered
      await expect.element(getByText("X")).toBeInTheDocument();
      await expect.element(getByText("Y")).toBeInTheDocument();
      expect(chromosomeMockFn).toHaveBeenCalledTimes(2);
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(1, {
        chromosome: "chrX",
        label: "X",
      });
      expect(chromosomeMockFn).toHaveBeenNthCalledWith(2, {
        label: "Y",
      });
    });
  });
});
