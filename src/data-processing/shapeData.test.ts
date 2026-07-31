import { test, expect, describe, vi } from "vitest";
import {
  splitChromosomeCopy,
  nestRegionsChromosomes,
  nestRegionsProportions,
} from "./shapeData";
import type {
  RegionParentMap,
  ChromosomeLengthObject,
  ChromosomeHaplotypeNoSplit,
  ChromosomeHaplotypeSplit,
  ChromosomeArm,
  ModelVersion,
  UnsortedRegionsEntry,
} from "../types";

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
      length: 80,
      centromere: [20, 30],
    },
  } as ChromosomeLengthObject,
}));

describe("splitChromosomeCopy", () => {
  test("split autosomal chromosome copy around the centromere", () => {
    const chromosomeCopy = [
      {
        start: 0,
        end: 10,
        region: "region_1",
      },
      {
        start: 0,
        end: 10,
        region: "region_1_1",
      },
      {
        start: 10,
        end: 50,
        region: "region_2",
      },
      {
        start: 10,
        end: 20,
        region: "region_2_1",
      },
      {
        start: 20,
        end: 40,
        region: "region_2_2",
      },
      {
        start: 40,
        end: 50,
        region: "region_2_3",
      },
      {
        start: 50,
        end: 70,
        region: "region_3",
      },
      {
        start: 70,
        end: 100,
        region: "region_4",
      },
      {
        start: 70,
        end: 80,
        region: "region_4_1",
      },
      {
        start: 80,
        end: 100,
        region: "region_4_2",
      },
    ] as ChromosomeHaplotypeNoSplit;

    // index!=23 means an autosomal chromosome, with a centromere at 30
    expect(splitChromosomeCopy(chromosomeCopy, 1)).toEqual([
      [
        chromosomeCopy[0],
        chromosomeCopy[1],
        // The third and fifth segments are split, ending at 30 in this arm
        {
          ...chromosomeCopy[2],
          end: 30,
        },
        // The fourth segment remains only in the first arm
        chromosomeCopy[3],
        {
          ...chromosomeCopy[4],
          end: 30,
        },
      ],
      [
        // The third and fifth segments are split, starting at 30 in this arm
        {
          ...chromosomeCopy[2],
          start: 30,
        },
        {
          ...chromosomeCopy[4],
          start: 30,
        },
        chromosomeCopy[5],
        chromosomeCopy[6],
        chromosomeCopy[7],
        chromosomeCopy[8],
        chromosomeCopy[9],
      ],
    ] as ChromosomeHaplotypeSplit);
  });

  test("split X chromosome copy around the centromere", () => {
    const chromosomeCopy = [
      {
        start: 0,
        end: 10,
        region: "region_1",
      },
      {
        start: 0,
        end: 10,
        region: "region_1_1",
      },
      {
        start: 10,
        end: 50,
        region: "region_2",
      },
      {
        start: 10,
        end: 20,
        region: "region_2_1",
      },
      {
        start: 20,
        end: 40,
        region: "region_2_2",
      },
      {
        start: 40,
        end: 50,
        region: "region_2_3",
      },
      {
        start: 50,
        end: 70,
        region: "region_3",
      },
      {
        start: 70,
        end: 80,
        region: "region_4",
      },
      {
        start: 70,
        end: 75,
        region: "region_4_1",
      },
      {
        start: 75,
        end: 80,
        region: "region_4_2",
      },
    ] as ChromosomeHaplotypeNoSplit;

    // index=23 means the X chromosome, with a centromere at 25
    expect(splitChromosomeCopy(chromosomeCopy, 23)).toEqual([
      [
        chromosomeCopy[0],
        chromosomeCopy[1],
        // The third and fifth segments are split, ending at 25 in this arm
        {
          ...chromosomeCopy[2],
          end: 25,
        },
        // The fourth segment remains only in the first arm
        chromosomeCopy[3],
        {
          ...chromosomeCopy[4],
          end: 25,
        },
      ],
      [
        // The third and fifth segments are split, starting at 25 in this arm
        {
          ...chromosomeCopy[2],
          start: 25,
        },
        {
          ...chromosomeCopy[4],
          start: 25,
        },
        chromosomeCopy[5],
        chromosomeCopy[6],
        chromosomeCopy[7],
        chromosomeCopy[8],
        chromosomeCopy[9],
      ],
    ] as ChromosomeHaplotypeSplit);
  });
});

test("nestRegionsChromosomes returns the segments nested", () => {
  const chromosomeCopy = [
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
  ] as ChromosomeHaplotypeNoSplit;

  expect(nestRegionsChromosomes(chromosomeCopy)).toEqual([
    {
      start: 0,
      end: 100,
      region: "world",
      depth: 0,
      cssClass: "world",
      subsegments: [
        {
          start: 0,
          end: 20,
          region: "region_3",
          depth: 1,
          cssClass: "region_3",
        },
        {
          start: 20,
          end: 60,
          region: "region_2",
          depth: 1,
          cssClass: "region_2",
          subsegments: [
            {
              start: 20,
              end: 30,
              region: "region_2_1",
              depth: 2,
              cssClass: "region_2_1",
            },
            {
              start: 30,
              end: 50,
              region: "region_2_2",
              depth: 2,
              cssClass: "region_2_2",
            },
            {
              start: 50,
              end: 60,
              region: "region_2_3",
              depth: 2,
              cssClass: "region_2_3",
            },
          ],
        },
        {
          start: 60,
          end: 90,
          region: "region_4",
          depth: 1,
          cssClass: "region_4",
          subsegments: [
            {
              start: 60,
              end: 70,
              region: "region_4_&_1",
              depth: 2,
              cssClass: "region_4_1",
            },
            {
              start: 70,
              end: 90,
              region: "region_4_2",
              depth: 2,
              cssClass: "region_4_2",
            },
          ],
        },
        {
          start: 90,
          end: 100,
          region: "region_1",
          depth: 1,
          cssClass: "region_1",
          subsegments: [
            {
              start: 90,
              end: 100,
              region: "region_1_1",
              depth: 2,
              cssClass: "region_1_1",
            },
          ],
        },
      ],
    },
  ] as ChromosomeArm);
});

test("nestRegionsProportions returns the regions nested", () => {
  const version = "v7.0" as ModelVersion;
  const regionsObject = {
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
  } as UnsortedRegionsEntry;

  expect(nestRegionsProportions(regionsObject, version)).toEqual({
    world: {
      ...regionsObject.world,
      subregions: {
        region_1: {
          ...regionsObject.region_1,
          subregions: {
            region_1_1: regionsObject.region_1_1,
          },
        },
        region_2: {
          ...regionsObject.region_2,
          subregions: {
            region_2_1: regionsObject.region_2_1,
            region_2_2: regionsObject.region_2_2,
            region_2_3: regionsObject.region_2_3,
          },
        },
        region_3: regionsObject.region_3,
        region_4: {
          ...regionsObject.region_4,
          subregions: {
            "region_4_&_1": regionsObject["region_4_&_1"],
            region_4_2: regionsObject.region_4_2,
          },
        },
      },
    },
  });
});
