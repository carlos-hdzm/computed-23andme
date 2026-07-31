import { describe, test, expect } from "vitest";
import type {
  ChromosomeHaplotypeSplit,
  ComputedData,
  ComputedDataV5Entry,
  ComputedDataV7Entry,
  ConfidenceEntry,
  SortedRegionsEntry,
} from "../types";
import { validateAndCleanUpEntries } from "./validateProcessedData";

const validChromosome = [
  [{ start: 0, end: 1 }],
  [{ start: 1, end: 2 }],
] as unknown as ChromosomeHaplotypeSplit;

const validRegion = ["region", {}];

const validConfidenceEntry = {
  chromosomes: {
    autosomal: Array(22).fill(validChromosome),
    sex: [validChromosome, validChromosome],
  },
  regions: [validRegion],
} as unknown as ConfidenceEntry;

const validVersion = (includeMostLikely: boolean = false) =>
  ({
    50: validConfidenceEntry,
    60: validConfidenceEntry,
    70: validConfidenceEntry,
    80: validConfidenceEntry,
    90: validConfidenceEntry,
    ...(includeMostLikely ? { mostLikely: validConfidenceEntry } : {}),
  }) as unknown as ComputedDataV5Entry | ComputedDataV7Entry;

const validProcessedData = {
  "v5.2": validVersion(),
  "v5.9": validVersion(),
  "v7.0": validVersion(true),
} as unknown as ComputedData;

const emptyChromosomeData = {
  autosomal: [],
  sex: [[], []],
};
const emptyRegionData = [] as SortedRegionsEntry;

const emptyDataConfidenceEntry = {
  chromosomes: emptyChromosomeData,
  regions: emptyRegionData,
};

describe("validateAndCleanUpEntries", () => {
  test("Complete data should not throw error", () => {
    expect(() => validateAndCleanUpEntries(validProcessedData)).not.toThrow();
  });

  test("Data missing a version but valid otherwise should not throw error", () => {
    const missingVersionData = {
      "v5.2": {
        50: emptyDataConfidenceEntry,
        60: emptyDataConfidenceEntry,
        70: emptyDataConfidenceEntry,
        80: emptyDataConfidenceEntry,
        90: emptyDataConfidenceEntry,
      },
      "v5.9": validVersion(),
      "v7.0": validVersion(true),
    } as unknown as ComputedData;

    expect(() => validateAndCleanUpEntries(missingVersionData)).not.toThrow();
    // Missing version should have been deleted
    expect(missingVersionData).not.toHaveProperty("v5.2");
    expect(missingVersionData).toHaveProperty("v5.9");
    expect(missingVersionData).toHaveProperty("v7.0");
  });

  describe("Data with a mismatch in confidence levels should throw error", () => {
    test("Missing numeric confidence level", () => {
      const missingConfidenceLevelData = {
        "v5.2": {
          // Confidence level 50 is missing
          60: validConfidenceEntry,
          70: validConfidenceEntry,
          80: validConfidenceEntry,
          90: validConfidenceEntry,
        },
        "v5.9": validVersion(),
        "v7.0": validVersion(true),
      } as unknown as ComputedData;

      expect(() =>
        validateAndCleanUpEntries(missingConfidenceLevelData),
      ).toThrow("Invalid data");
    });

    test("Missing mostLikely confidence level", () => {
      const missingConfidenceLevelData = {
        "v5.2": validVersion(),
        "v5.9": validVersion(),
        "v7.0": {
          50: validConfidenceEntry,
          60: validConfidenceEntry,
          70: validConfidenceEntry,
          80: validConfidenceEntry,
          90: validConfidenceEntry,
          // Confidence level mostLikely is missing
        },
      } as unknown as ComputedData;

      expect(() =>
        validateAndCleanUpEntries(missingConfidenceLevelData),
      ).toThrow("Invalid data");
    });

    test("Unrecognized confidence level", () => {
      const unrecognizedConfidenceLevelData = {
        "v5.2": validVersion(),
        "v5.9": {
          50: validConfidenceEntry,
          60: validConfidenceEntry,
          70: validConfidenceEntry,
          80: validConfidenceEntry,
          90: validConfidenceEntry,
          newLevel: validConfidenceEntry,
          // Confidence level 'newLevel' is unrecognized
        },
        "v7.0": validVersion(true),
      } as unknown as ComputedData;

      expect(() =>
        validateAndCleanUpEntries(unrecognizedConfidenceLevelData),
      ).toThrow("Invalid data");
    });
  });

  describe("Data not missing a version but missing data should throw error", () => {
    test("Empty chromosomes", () => {
      const emptyChromosomesData = {
        "v5.2": validVersion(),
        "v5.9": {
          50: validConfidenceEntry,
          60: validConfidenceEntry,
          70: validConfidenceEntry,
          // Confidence level 80 has empty chromosomes
          80: {
            chromosomes: emptyChromosomeData,
            regions: validConfidenceEntry.regions,
          },
          90: validConfidenceEntry,
        },
        "v7.0": validVersion(true),
      } as unknown as ComputedData;

      expect(() => validateAndCleanUpEntries(emptyChromosomesData)).toThrow(
        "Invalid data",
      );
    });

    test("Empty regions", () => {
      const emptyRegionsData = {
        "v5.2": validVersion(),
        "v5.9": {
          50: validConfidenceEntry,
          60: validConfidenceEntry,
          // Confidence level 70 has empty chromosomes
          70: {
            chromosomes: validConfidenceEntry.chromosomes,
            regions: emptyRegionData,
          },
          80: validConfidenceEntry,
          90: validConfidenceEntry,
        },
        "v7.0": validVersion(true),
      } as unknown as ComputedData;

      expect(() => validateAndCleanUpEntries(emptyRegionsData)).toThrow(
        "Invalid data",
      );
    });

    test("Empty chromosome and regions", () => {
      const emptyConfidenceLevelData = {
        "v5.2": {
          50: validConfidenceEntry,
          60: validConfidenceEntry,
          70: validConfidenceEntry,
          80: validConfidenceEntry,
          // Confidence level 90 is empty
          90: emptyDataConfidenceEntry,
        },
        "v5.9": validVersion(),
        "v7.0": validVersion(true),
      } as unknown as ComputedData;

      // Should throw, but it's failing because all confidence levels are present but one is empty,
      // So it thinks it's the case where the version is not present in the data
      expect(() => validateAndCleanUpEntries(emptyConfidenceLevelData)).toThrow(
        "Invalid data",
      );
    });
  });

  describe("Data with invalid chromosome data should throw error", () => {
    test("Less than 22 autosomal chromosomes", () => {
      const tooFewChromosomesConfidenceEntry = {
        ...validConfidenceEntry,
        chromosomes: {
          ...validConfidenceEntry.chromosomes,
          // Only 10 autosomal chromosomes
          autosomal: Array(10).fill(validChromosome),
        },
      };

      const tooFewChromosomesVersion = {
        50: tooFewChromosomesConfidenceEntry,
        60: tooFewChromosomesConfidenceEntry,
        70: tooFewChromosomesConfidenceEntry,
        80: tooFewChromosomesConfidenceEntry,
        90: tooFewChromosomesConfidenceEntry,
      };

      const tooFewChromosomesData = {
        "v5.2": tooFewChromosomesVersion,
        "v5.9": tooFewChromosomesVersion,
        "v7.0": {
          ...tooFewChromosomesVersion,
          mostLikely: tooFewChromosomesConfidenceEntry,
        },
      } as unknown as ComputedData;

      expect(() => validateAndCleanUpEntries(tooFewChromosomesData)).toThrow(
        "Invalid data",
      );
    });
    test("More than 22 autosomal chromosomes", () => {
      const tooManyChromosomesConfidenceEntry = {
        ...validConfidenceEntry,
        chromosomes: {
          ...validConfidenceEntry.chromosomes,
          // 30 autosomal chromosomes
          autosomal: Array(30).fill(validChromosome),
        },
      };

      const tooManyChromosomesVersion = {
        50: tooManyChromosomesConfidenceEntry,
        60: tooManyChromosomesConfidenceEntry,
        70: tooManyChromosomesConfidenceEntry,
        80: tooManyChromosomesConfidenceEntry,
        90: tooManyChromosomesConfidenceEntry,
      };

      const tooManyChromosomesData = {
        "v5.2": tooManyChromosomesVersion,
        "v5.9": tooManyChromosomesVersion,
        "v7.0": {
          ...tooManyChromosomesVersion,
          mostLikely: tooManyChromosomesConfidenceEntry,
        },
      } as unknown as ComputedData;

      expect(() => validateAndCleanUpEntries(tooManyChromosomesData)).toThrow(
        "Invalid data",
      );
    });

    test("More than 2 sex chromosomes", () => {
      const tooManySexChromosomesConfidenceEntry = {
        ...validConfidenceEntry,
        chromosomes: {
          ...validConfidenceEntry.chromosomes,
          // 5 sex chromosomes
          sex: Array(5).fill(validChromosome),
        },
      };

      const tooManySexChromosomesVersion = {
        50: tooManySexChromosomesConfidenceEntry,
        60: tooManySexChromosomesConfidenceEntry,
        70: tooManySexChromosomesConfidenceEntry,
        80: tooManySexChromosomesConfidenceEntry,
        90: tooManySexChromosomesConfidenceEntry,
      };

      const tooManySexChromosomesData = {
        "v5.2": tooManySexChromosomesVersion,
        "v5.9": tooManySexChromosomesVersion,
        "v7.0": {
          ...tooManySexChromosomesVersion,
          mostLikely: tooManySexChromosomesConfidenceEntry,
        },
      } as unknown as ComputedData;

      expect(() =>
        validateAndCleanUpEntries(tooManySexChromosomesData),
      ).toThrow("Invalid data");
    });
  });

  test("Only 1 sex chromosome should not throw error", () => {
    const geneticMaleConfidenceEntry = {
      ...validConfidenceEntry,
      chromosomes: {
        ...validConfidenceEntry.chromosomes,
        // Only 1 sex chromosome (genetic male)
        sex: [validChromosome],
      },
    };

    const geneticMaleVersion = {
      50: geneticMaleConfidenceEntry,
      60: geneticMaleConfidenceEntry,
      70: geneticMaleConfidenceEntry,
      80: geneticMaleConfidenceEntry,
      90: geneticMaleConfidenceEntry,
    };

    const geneticMaleData = {
      "v5.2": geneticMaleVersion,
      "v5.9": geneticMaleVersion,
      "v7.0": {
        ...geneticMaleVersion,
        mostLikely: geneticMaleConfidenceEntry,
      },
    } as unknown as ComputedData;

    expect(() => validateAndCleanUpEntries(geneticMaleData)).not.toThrow();
  });
});
