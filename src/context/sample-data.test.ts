import { test, expect } from "vitest";
import getSampleContextData from "./sample-data";
import sampleData from "../../assets/json/sample-data.json" with { type: "json" };

test("getSampleContextData returns the correct sample data structure", async () => {
  await expect(getSampleContextData()).resolves.toEqual({
    version: "v7.0",
    confidence: "mostLikely",
    data: sampleData,
    highlight: "",
  });
});
