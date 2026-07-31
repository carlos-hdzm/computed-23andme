import { test, expect, describe } from "vitest";
import sortSubregionsByProportion from "./sortSubregions";
import type { SortedRegionsEntry, UnsortedRegionsEntry } from "../types";

describe("sortSubregionsByProportion should return the subregions in the right order", () => {
  describe("No unassigned or broadly categories", () => {
    test("One single region returns the same", () => {
      const subregions = {
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 1,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions)).toEqual([
        ["region_1", subregions["region_1"]],
      ] as SortedRegionsEntry);
    });

    test("Two equally-proportionate regions returns them in the same order as presented", () => {
      const subregions = {
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.5,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.5,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions)).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
      ] as SortedRegionsEntry);
    });

    test("Two unequal regions returns them sorted from highest to lowest total proportion", () => {
      const subregions = {
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.3,
          },
        },
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.7,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions)).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
      ] as SortedRegionsEntry);
    });
  });

  describe("Unassigned category", () => {
    test("One single unassigned region returns it", () => {
      const subregions = {
        unassigned: {
          label: "Unassigned",
          cssClass: "unassigned",
          total: {
            proportion: 1,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsUnassigned: true })).toEqual([
        ["unassigned", subregions["unassigned"]],
      ] as SortedRegionsEntry);
    });

    test("One region and unassigned region returns the unassigned region last", () => {
      const subregions = {
        unassigned: {
          label: "Unassigned",
          cssClass: "unassigned",
          total: {
            proportion: 0.8,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.2,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsUnassigned: true })).toEqual([
        ["region_1", subregions["region_1"]],
        ["unassigned", subregions["unassigned"]],
      ] as SortedRegionsEntry);
    });

    test("Two equally-proportionate regions and unassigned region returns the regions in the order presented and the unassigned region last", () => {
      const subregions = {
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.3,
          },
        },
        unassigned: {
          label: "Unassigned",
          cssClass: "unassigned",
          total: {
            proportion: 0.4,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.3,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsUnassigned: true })).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
        ["unassigned", subregions["unassigned"]],
      ] as SortedRegionsEntry);
    });

    test("Two unequal regions and unassigned returns them sorted with the unassigned region last", () => {
      const subregions = {
        unassigned: {
          label: "Unassigned",
          cssClass: "unassigned",
          total: {
            proportion: 0.3,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.1,
          },
        },
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.6,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsUnassigned: true })).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
        ["unassigned", subregions["unassigned"]],
      ] as SortedRegionsEntry);
    });
  });

  describe("Broadly category", () => {
    test("One single broadly region returns it", () => {
      const subregions = {
        broadly_region_0: {
          label: "Broadly Region 0",
          cssClass: "broadly_region_0",
          total: {
            proportion: 1,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsBroadly: true })).toEqual([
        ["broadly_region_0", subregions["broadly_region_0"]],
      ] as SortedRegionsEntry);
    });

    test("One region and broadly region returns the broadly region last", () => {
      const subregions = {
        broadly_region_0: {
          label: "Broadly Region 0",
          cssClass: "broadly_region_0",
          total: {
            proportion: 0.8,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.2,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsBroadly: true })).toEqual([
        ["region_1", subregions["region_1"]],
        ["broadly_region_0", subregions["broadly_region_0"]],
      ] as SortedRegionsEntry);
    });

    test("Two equally-proportionate regions and broadly region returns the regions in the order presented and the broadly region last", () => {
      const subregions = {
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.3,
          },
        },
        broadly_region_0: {
          label: "Broadly Region 0",
          cssClass: "broadly_region_0",
          total: {
            proportion: 0.4,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.3,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsBroadly: true })).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
        ["broadly_region_0", subregions["broadly_region_0"]],
      ] as SortedRegionsEntry);
    });

    test("Two unequal regions and broadly returns them sorted with the broadly region last", () => {
      const subregions = {
        broadly_region_0: {
          label: "Broadly Region 0",
          cssClass: "broadly_region_0",
          total: {
            proportion: 0.3,
          },
        },
        region_1: {
          label: "Region 1",
          cssClass: "region_1",
          total: {
            proportion: 0.1,
          },
        },
        region_2: {
          label: "Region 2",
          cssClass: "region_2",
          total: {
            proportion: 0.6,
          },
        },
      } as unknown as UnsortedRegionsEntry;
      expect(sortSubregionsByProportion(subregions, { containsBroadly: true })).toEqual([
        ["region_2", subregions["region_2"]],
        ["region_1", subregions["region_1"]],
        ["broadly_region_0", subregions["broadly_region_0"]],
      ] as SortedRegionsEntry);
    });
  });
});
