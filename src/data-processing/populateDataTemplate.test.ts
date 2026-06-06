import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import * as populateDataTemplateFunctions from "./populateDataTemplate-util";
import { populateDataTemplate } from "./populateDataTemplate";
import * as createTemplates from "./createTemplates";
import type {
  ChromosomeHaplotypeNoSplit,
  ComputedData,
  ComputedDataEntry,
  ConfidenceEntry,
  UnsortedRegionsEntry,
} from "../types";

const createDataTemplateSpy = vi.spyOn(createTemplates, "createDataTemplate");

const populateSegmentDataSpy = vi.spyOn(
  populateDataTemplateFunctions,
  "populateSegmentData",
);

const populateProportionDataSpy = vi.spyOn(
  populateDataTemplateFunctions,
  "populateProportionData",
);

describe("populateDataTemplate", () => {
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
  });

  afterEach(() => {
    createDataTemplateSpy.mockRestore();
    populateSegmentDataSpy.mockRestore();
    populateProportionDataSpy.mockRestore();
  });

  test("should call populateSegmentData for segment labels and populateProportionData for proportion labels", () => {
    const computedData = [
      {
        label: "test-label-1",
        name: "ap2_smoother_45_populations:segments_50_percent_confidence",
        data: "test-data-1",
      },
      {
        label: "test-label-2",
        name: "ap2_smoother_45_populations_v2:proportions_60_percent_confidence",
        data: "test-data-2",
      },
      {
        label: "test-label-3",
        name: "ap2_smoother_78_populations:segments_70_percent_confidence",
        data: "test-data-3",
      },
      {
        label: "test-label-4",
        name: "ap2_smoother_78_populations:proportions_greedy_path_to_leaf",
        data: "test-data-4",
      },
      {
        label: "test-label-5",
        name: "invalid_label_format",
        data: "test-data-5",
      },
    ] as Pick<ComputedDataEntry, "label" | "name" | "data">[];

    populateSegmentDataSpy.mockImplementation(vi.fn());
    populateProportionDataSpy.mockImplementation(vi.fn());

    const dataTemplate = createDataTemplateSpy();

    populateDataTemplate(computedData as ComputedDataEntry[]);

    expect(populateSegmentDataSpy).toHaveBeenCalledTimes(2);
    expect(populateSegmentDataSpy).toHaveBeenCalledWith(
      computedData[0].label,
      dataTemplate["v5.2"]![50] as ConfidenceEntry<
        ChromosomeHaplotypeNoSplit,
        UnsortedRegionsEntry
      >,
      computedData[0].data,
    );
    expect(populateSegmentDataSpy).toHaveBeenCalledWith(
      computedData[2].label,
      dataTemplate["v7.0"]![70] as ConfidenceEntry<
        ChromosomeHaplotypeNoSplit,
        UnsortedRegionsEntry
      >,
      computedData[2].data,
    );

    expect(populateProportionDataSpy).toHaveBeenCalledTimes(2);
    expect(populateProportionDataSpy).toHaveBeenCalledWith(
      computedData[1].label,
      dataTemplate["v5.9"]![60] as ConfidenceEntry<
        ChromosomeHaplotypeNoSplit,
        UnsortedRegionsEntry
      >,
      computedData[1].data,
    );
    expect(populateProportionDataSpy).toHaveBeenCalledWith(
      computedData[3].label,
      dataTemplate["v7.0"]!["mostLikely"] as ConfidenceEntry<
        ChromosomeHaplotypeNoSplit,
        UnsortedRegionsEntry
      >,
      computedData[3].data,
    );
  });
});
