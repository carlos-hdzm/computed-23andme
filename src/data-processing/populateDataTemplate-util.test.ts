import { describe, test, expect } from "vitest";
import { populateSegmentData, populateProportionData } from "./populateDataTemplate-util";
import type {
  ChromosomeHaplotypeNoSplit,
  ConfidenceEntry,
  UnsortedRegionsEntry,
} from "../types";

const confidenceEntry = {
  chromosomes: {
    autosomal: [],
    sex: [[]],
  },
  regions: {},
} as unknown as ConfidenceEntry<
  ChromosomeHaplotypeNoSplit,
  UnsortedRegionsEntry
>;

describe("populateSegmentData", () => {
  const expectedData = {
    autosomal: [
      ["chr1_hap1_1000_2000", 1, 1, 1000, 2000],
      ["chr1_hap2_3000_4000", 1, 2, 3000, 4000],
    ] as [string, number, 1 | 2, number, number][],
    sex: [
      ["chrX-npar_hap1_500_1500", 1, 500, 1500],
      ["chrX-npar_hap2_5000_7500", 2, 5000, 7500],
    ] as [string, 1 | 2, number, number][],
  };
  const data = "test_region";

  test.for(expectedData.autosomal)(
    "should populate autosomal chromosome segment data for label: %s",
    ([label, chrNumber, hapNumber, start, end]) => {
      populateSegmentData(label, confidenceEntry, data);

      expect(
        confidenceEntry.chromosomes.autosomal[chrNumber - 1][hapNumber - 1],
      ).toContainEqual({
        start: start,
        end: end,
        region: data,
        depth: 0,
      });
    },
  );

  test.for(expectedData.sex)(
    "should populate sex chromosome segment data for label: %s",
    ([label, hapNumber, start, end]) => {
      populateSegmentData(label, confidenceEntry, data);

      expect(confidenceEntry.chromosomes.sex[hapNumber - 1]).toContainEqual({
        start: start,
        end: end,
        region: data,
        depth: 0,
      });
    },
  );

  test("should return undefined for invalid label format", () => {
    expect(
      populateSegmentData("invalid label", confidenceEntry, data),
    ).toBeUndefined();
  });
});

describe("populateProportionData", () => {
  const expectedData = [
    [
      "population_proportions_test_region_1_hap1_proportion",
      "test_region_1",
      "hap1",
      "proportion",
      "0.5",
    ],
    [
      "population_proportions_test_region_2_hap2_cm_proportion",
      "test_region_2",
      "hap2",
      "cm_proportion",
      "0.5",
    ],
    [
      "population_proportions_test_region_3_&_region_4_total_length",
      "test_region_3_&_region_4",
      "total",
      "length",
      "5000000",
    ],
    [
      "population_proportions_test_region-region_5_hap1_length_cm",
      "test_region-region_5",
      "hap1",
      "length_cm",
      "500",
    ],
  ] as [string, string, string, string, string][];
  const data = "test_region";

  test.for(expectedData)(
    "should populate region data for label: %s",
    ([label, region, hapNumber, property, data]) => {
      populateProportionData(label, confidenceEntry, data);

      expect(confidenceEntry.regions[region]).toEqual(
        expect.objectContaining({
          depth: 0,
          [hapNumber]: expect.objectContaining({
            proportion: 0,
            cm_proportion: 0,
            length: 0,
            length_cm: 0,
            [property]: Number.parseFloat(data),
          }),
        }),
      );
    },
  );

  test("should return undefined for invalid label format", () => {
    expect(
      populateProportionData("invalid label", confidenceEntry, data),
    ).toBeUndefined();
  });
});
