import { test, expect } from "vitest";
import initialData from "./initial-data";

test("initialData returns the correct initial data structure", () => {
  const result = initialData();

  expect(result).toEqual({
    version: "",
    confidence: "",
    data: {},
    highlight: "",
  });
});
