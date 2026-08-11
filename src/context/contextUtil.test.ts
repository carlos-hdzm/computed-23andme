import { describe, test, expect } from "vitest";
import getDataValues, { getAvailableVersions } from "./contextUtil";
import type { ComputedData } from "../types";

describe("getAvailableVersions", () => {
  test("returns an array of available versions", () => {
    const data = {
      "v5.2": {},
      "v5.9": {},
      "v7.0": {},
    } as ComputedData;

    expect(getAvailableVersions(data)).toEqual(["v5.2", "v5.9", "v7.0"]);
  });

  test("handles versions not in versionValues", () => {
    const data = {
      "v5.2": {},
      "v5.9": {},
      "v8.0": {},
    } as unknown as ComputedData;

    expect(getAvailableVersions(data)).toEqual(["v5.2", "v5.9"]);
  });

  describe("handles no available versions", () => {
    test("empty data", () => {
      const data = {} as ComputedData;

      expect(() => getAvailableVersions(data)).toThrow(
        "No available versions found in the data.",
      );
    });

    test("non-empty data but no matching versions", () => {
      const data = {
        "v8.0": {},
        "v8.1": {},
      } as unknown as ComputedData;

      expect(() => getAvailableVersions(data)).toThrow(
        "No available versions found in the data.",
      );
    });
  });
});

describe("getDataValues", () => {
  test("returns the latest version and its first confidence level", () => {
    const data = {
      "v5.2": {},
      "v5.9": {},
      "v7.0": {},
    } as ComputedData;

    expect(getDataValues(data)).toEqual({
      version: "v7.0",
      confidence: "mostLikely",
    });
  });

  test("returns the latest version out of the matching ones and its first confidence level", () => {
    const data = {
      "v5.2": {},
      "v5.9": {},
      "v8.0": {}, // v8.0 is not in versionValues, so it should be ignored
    } as unknown as ComputedData;

    expect(getDataValues(data)).toEqual({
      version: "v5.9",
      confidence: 50,
    });
  });

  // Error from getAvailableVersions is propagated
  describe("handles no available versions", () => {
    test("empty data", () => {
      const data = {} as ComputedData;

      expect(() => getDataValues(data)).toThrow(
        "No available versions found in the data.",
      );
    });

    test("non-empty data but no matching versions", () => {
      const data = {
        "v8.0": {},
        "v8.1": {},
      } as unknown as ComputedData;

      expect(() => getDataValues(data)).toThrow(
        "No available versions found in the data.",
      );
    });
  });
});
