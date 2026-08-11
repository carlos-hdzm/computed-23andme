import { test, expect } from "vitest";
import sampleContextData from "./sample-data";
import sampleData from "../../assets/json/sample-data.json" with { type: "json" };

test("sampleContextData returns the correct sample data structure", () => {
  expect(sampleContextData).toEqual({
    version: "v7.0",
    confidence: 50,
    data: sampleData,
    highlight: "",
  });
});
