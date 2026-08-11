import { expect, describe, test } from "vitest";
import actions from "./actions";
import type {
  ComputedData,
  ConfidenceLevel,
  ModelVersion,
} from "../types";

describe("context actions", () => {
  test("setData", () => {
    const data = { test: "data" } as ComputedData;

    expect(actions.setData(data)).toEqual({
      type: "SET_DATA",
      data,
    });
  });

  test("setVersion", () => {
    const version: ModelVersion = "v5.2";

    expect(actions.setVersion(version)).toEqual({
      type: "SET_VERSION",
      version,
    });
  });

  test("setConfidence", () => {
    const confidence: ConfidenceLevel = 50;

    expect(actions.setConfidence(confidence)).toEqual({
      type: "SET_CONFIDENCE",
      confidence,
    });
  });

  test("setHighlight", () => {
    const highlight = "test-highlight";

    expect(actions.setHighlight(highlight)).toEqual({
      type: "SET_HIGHLIGHT",
      highlight,
    });
  });

  test("setSampleData", () => {
    expect(actions.setSampleData()).toEqual({
      type: "SET_SAMPLE_DATA",
    });
  });

  test("clearData", () => {
    expect(actions.clearData()).toEqual({
      type: "CLEAR_DATA",
    });
  });
});
