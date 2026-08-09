import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import * as createTemplates from "./createTemplates";
import type {
  AutosomalChromosomes,
  ChromosomeHaplotypeNoSplit,
  ChromosomeLengthObject,
  ComputedData,
  ComputedDataV7Entry,
  ModelVersion,
  RegionParentMap,
  UnsortedRegionsEntry,
} from "../types";
import * as validateProcessedData from "./validateProcessedData";
import { nestRegions } from "./processData";

const createDataTemplateSpy = vi.spyOn(createTemplates, "createDataTemplate");
const validateProcessedDataSpy = vi.spyOn(
  validateProcessedData,
  "validateAndCleanUpEntries",
);

vi.mock(import("./regionParsing.ts"), () => ({
  default: {
    "v5.2": {
      world: {
        depth: 0,
        label: "World",
      },
    },
    "v5.9": {
      world: {
        depth: 0,
        label: "World",
      },
    },
    "v7.0": {
      region_1: {
        ancestors: ["world"],
        depth: 1,
        label: "Region 1",
      },
      region_2_2: {
        ancestors: ["world", "region_2"],
        depth: 2,
        label: "Region 2.2",
      },
      region_2: {
        ancestors: ["world"],
        depth: 1,
        label: "Region 2",
      },
      region_3: {
        ancestors: ["world"],
        depth: 1,
        label: "Region 3",
      },
      region_2_3: {
        ancestors: ["world", "region_2"],
        depth: 2,
        label: "Region 2.3",
      },
      region_2_1: {
        ancestors: ["world", "region_2"],
        depth: 2,
        label: "Region 2.1",
      },
      "region_4_&_1": {
        ancestors: ["world", "region_4"],
        depth: 2,
        label: "Region 4.1",
      },
      world: {
        depth: 0,
        label: "World",
      },
      region_1_1: {
        ancestors: ["world", "region_1"],
        depth: 2,
        label: "Region 1.1",
      },
      region_4: {
        ancestors: ["world"],
        depth: 1,
        label: "Region 4",
      },
      region_1_1_1: {
        ancestors: ["world", "region_1", "region_1_1"],
        depth: 3,
        label: "Region 1.1.1",
      },
      region_4_2: {
        ancestors: ["world", "region_4"],
        depth: 2,
        label: "Region 4.2",
      },
    },
  } as RegionParentMap,
}));

vi.mock(import("../../assets/json/chromosomes.json"), () => ({
  default: {
    1: {
      length: 100,
      centromere: [25, 35],
    },
    "chrX-npar": {
      length: 100,
      centromere: [25, 35],
    },
  } as ChromosomeLengthObject,
}));

describe("processData", () => {
  beforeEach(() => {
    createDataTemplateSpy.mockReturnValue({
      "v5.2": {
        50: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        60: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        70: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        80: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        90: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
      },
      "v5.9": {
        50: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        60: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        70: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        80: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        90: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
      },
      "v7.0": {
        50: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        60: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        70: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        80: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        90: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
        mostLikely: {
          chromosomes: {
            autosomal: [],
            sex: [[], []],
          },
          regions: {},
        },
      },
    } as unknown as ComputedData<
      ChromosomeHaplotypeNoSplit,
      UnsortedRegionsEntry
    >);
    validateProcessedDataSpy.mockReturnValue();
  });

  afterEach(() => {
    createDataTemplateSpy.mockRestore();
    validateProcessedDataSpy.mockRestore();
  });

  test("nestRegions should correctly nest the regions", () => {
    const unsplitChromosomes =
      Array<[ChromosomeHaplotypeNoSplit, ChromosomeHaplotypeNoSplit]>(22);
    unsplitChromosomes[0] = [
      [
        {
          start: 0,
          end: 100,
          region: "world",
          depth: 0,
        },
        {
          start: 0,
          end: 20,
          region: "region_3",
          depth: 0,
        },
        {
          start: 20,
          end: 60,
          region: "region_2",
          depth: 0,
        },
        {
          start: 20,
          end: 30,
          region: "region_2_1",
          depth: 0,
        },
        {
          start: 30,
          end: 50,
          region: "region_2_2",
          depth: 0,
        },
        {
          start: 50,
          end: 60,
          region: "region_2_3",
          depth: 0,
        },
        {
          start: 60,
          end: 90,
          region: "region_4",
          depth: 0,
        },
        {
          start: 60,
          end: 70,
          region: "region_4_&_1",
          depth: 0,
        },
        {
          start: 70,
          end: 90,
          region: "region_4_2",
          depth: 0,
        },
        {
          start: 90,
          end: 100,
          region: "region_1",
          depth: 0,
        },
        {
          start: 90,
          end: 100,
          region: "region_1_1",
          depth: 0,
        },
      ] as ChromosomeHaplotypeNoSplit,
      [
        {
          start: 0,
          end: 100,
          region: "world",
          depth: 0,
        },
        {
          start: 0,
          end: 20,
          region: "region_3",
          depth: 0,
        },
        {
          start: 20,
          end: 60,
          region: "region_2",
          depth: 0,
        },
        {
          start: 20,
          end: 30,
          region: "region_2_1",
          depth: 0,
        },
        {
          start: 30,
          end: 50,
          region: "region_2_2",
          depth: 0,
        },
        {
          start: 50,
          end: 60,
          region: "region_2_3",
          depth: 0,
        },
        {
          start: 60,
          end: 90,
          region: "region_4",
          depth: 0,
        },
        {
          start: 60,
          end: 70,
          region: "region_4_&_1",
          depth: 0,
        },
        {
          start: 70,
          end: 90,
          region: "region_4_2",
          depth: 0,
        },
        {
          start: 90,
          end: 100,
          region: "region_1",
          depth: 0,
        },
        {
          start: 90,
          end: 100,
          region: "region_1_1",
          depth: 0,
        },
      ] as ChromosomeHaplotypeNoSplit,
    ];

    const confidenceEntry = {
      chromosomes: {
        autosomal:
          unsplitChromosomes as unknown as AutosomalChromosomes<ChromosomeHaplotypeNoSplit>,
        sex: [unsplitChromosomes[0][0]],
      },
      regions: {
        region_1: {
          cssClass: "region_1",
          total: {
            proportion: 0.3,
            cm_proportion: 0.3,
            length: 30,
            length_cm: 30,
          },
          depth: 1,
          label: "Region 1",
        },
        region_2_2: {
          cssClass: "region_2_2",
          total: {
            proportion: 0.02,
            cm_proportion: 0.02,
            length: 2,
            length_cm: 2,
          },
          depth: 2,
          label: "Region 2.2",
        },
        region_2: {
          cssClass: "region_2",
          total: {
            proportion: 0.1,
            cm_proportion: 0.1,
            length: 10,
            length_cm: 10,
          },
          depth: 1,
          label: "Region 2",
        },
        region_3: {
          cssClass: "region_3",
          total: {
            proportion: 0.4,
            cm_proportion: 0.4,
            length: 40,
            length_cm: 40,
          },
          depth: 1,
          label: "Region 3",
        },
        region_2_3: {
          cssClass: "region_2_3",
          total: {
            proportion: 0.07,
            cm_proportion: 0.07,
            length: 7,
            length_cm: 7,
          },
          depth: 2,
          label: "Region 2.3",
        },
        region_2_1: {
          cssClass: "region_2_1",
          total: {
            proportion: 0.01,
            cm_proportion: 0.01,
            length: 1,
            length_cm: 1,
          },
          depth: 2,
          label: "Region 2.1",
        },
        "region_4_&_1": {
          cssClass: "region_4_1",
          total: {
            proportion: 0.15,
            cm_proportion: 0.15,
            length: 15,
            length_cm: 15,
          },
          depth: 2,
          label: "Region 4.1",
        },
        world: {
          cssClass: "world",
          total: {
            proportion: 1,
            cm_proportion: 1,
            length: 100,
            length_cm: 100,
          },
          depth: 0,
          label: "World",
        },
        region_1_1: {
          cssClass: "region_1_1",
          total: {
            proportion: 0.3,
            cm_proportion: 0.3,
            length: 30,
            length_cm: 30,
          },
          depth: 2,
          label: "Region 1.1",
        },
        region_4: {
          cssClass: "region_4",
          total: {
            proportion: 0.2,
            cm_proportion: 0.2,
            length: 20,
            length_cm: 20,
          },
          depth: 1,
          label: "Region 4",
        },
        region_1_1_1: {
          cssClass: "region_1_1_1",
          total: {
            proportion: 0.3,
            cm_proportion: 0.3,
            length: 30,
            length_cm: 30,
          },
          depth: 3,
          label: "Region 1.1.1",
        },
        region_4_2: {
          cssClass: "region_4_2",
          total: {
            proportion: 0.05,
            cm_proportion: 0.05,
            length: 5,
            length_cm: 5,
          },
          depth: 2,
          label: "Region 4.2",
        },
      } as UnsortedRegionsEntry,
    };

    const processedData = {
      "v7.0": {
        50: confidenceEntry,
        mostLikely: confidenceEntry,
      },
    } as ComputedData<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>;

    const processedDataRegions = (
      processedData["v7.0"] as ComputedDataV7Entry<
        ChromosomeHaplotypeNoSplit,
        UnsortedRegionsEntry
      >
    )[50].regions;
    const processedDataChromosome = unsplitChromosomes[0][0];
    const nestedRegionsV7 = nestRegions(processedData)[
      "v7.0" as ModelVersion
    ] as ComputedDataV7Entry;
    const splitChromosome = [
      [
        {
          ...processedDataChromosome[0],
          end: 30,
          subsegments: [
            {
              ...processedDataChromosome[1],
              depth: 1,
            },
            {
              ...processedDataChromosome[2],
              end: 30,
              depth: 1,
              subsegments: [{
                ...processedDataChromosome[3],
                depth: 2,
              }],
            },
          ],
        },
      ],
      [
        {
          ...processedDataChromosome[0],
          start: 30,
          subsegments: [
            {
              ...processedDataChromosome[2],
              start: 30,
              depth: 1,
              subsegments: [
                {
                  ...processedDataChromosome[4],
                  depth: 2,
                },
                {
                  ...processedDataChromosome[5],
                  depth: 2,
                },
              ],
            },
            {
              ...processedDataChromosome[6],
              depth: 1,
              subsegments: [
                {
                  ...processedDataChromosome[7],
                  depth: 2,
                },
                {
                  ...processedDataChromosome[8],
                  depth: 2,
                },
              ],
            },
            {
              ...processedDataChromosome[9],
              depth: 1,
              subsegments: [{
                ...processedDataChromosome[10],
                depth: 2,
              }],
            },
          ],
        },
      ],
    ];

    expect(nestedRegionsV7[50]).toHaveProperty("regions", [
      ["region_3", processedDataRegions.region_3],
      [
        "region_1",
        {
          ...processedDataRegions.region_1,
          subregions: [["region_1_1", {
            ...processedDataRegions.region_1_1,
            subregions: [["region_1_1_1", processedDataRegions.region_1_1_1]],
          }]],
        },
      ],
      [
        "region_4",
        {
          ...processedDataRegions.region_4,
          subregions: [
            ["region_4_&_1", processedDataRegions["region_4_&_1"]],
            ["region_4_2", processedDataRegions.region_4_2],
          ],
        },
      ],
      [
        "region_2",
        {
          ...processedDataRegions.region_2,
          subregions: [
            ["region_2_3", processedDataRegions.region_2_3],
            ["region_2_2", processedDataRegions.region_2_2],
            ["region_2_1", processedDataRegions.region_2_1],
          ],
        },
      ],
    ]);
    expect(nestedRegionsV7[50]).toHaveProperty(["chromosomes", "autosomal", 0]);
    expect(nestedRegionsV7[50].chromosomes.autosomal[0]).toMatchObject([splitChromosome, splitChromosome]);
    expect(nestedRegionsV7[50]).toHaveProperty(["chromosomes", "sex", 0]);
    expect(nestedRegionsV7[50].chromosomes.sex[0]).toMatchObject(splitChromosome);

    // For this test, we use the same data for the mostLikely confidence level, so the results should be the same
    expect(nestedRegionsV7.mostLikely).toEqual(nestedRegionsV7[50]);
  });
});
