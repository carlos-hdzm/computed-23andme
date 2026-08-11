import { describe, test, expect, vi } from "vitest";
import dataReducer from "./reducer";
import type {
  ComputedData,
  ConfidenceEntry,
  ConfidenceLevel,
  ContextData,
  ModelVersion,
} from "../types";

vi.mock(import("./sample-data"), () => ({
  default: {
    version: "v5.9",
    confidence: 70,
    data: { "v5.9": { 70: {} as ConfidenceEntry } } as unknown as ComputedData,
    highlight: "sample-highlight",
  } as ContextData,
}));

describe("dataReducer", () => {
  const initialState: ContextData = {
    version: "v7.0",
    confidence: 50,
    data: {},
    highlight: "",
  };

  test("setData", () => {
    const data = { test: "data" } as ComputedData;

    expect(
      dataReducer(initialState, {
        type: "SET_DATA",
        data,
      }),
    ).toEqual({
      version: "v7.0",
      confidence: 50,
      data: { test: "data" } as ComputedData,
      highlight: "",
    });
  });

  test("setVersion", () => {
    const version: ModelVersion = "v5.2";

    expect(
      dataReducer(initialState, {
        type: "SET_VERSION",
        version,
      }),
    ).toEqual({
      version: "v5.2",
      confidence: 50,
      data: {},
      highlight: "",
    });
  });

  test("setConfidence", () => {
    const confidence: ConfidenceLevel = 90;

    expect(
      dataReducer(initialState, {
        type: "SET_CONFIDENCE",
        confidence,
      }),
    ).toEqual({
      version: "v7.0",
      confidence: 90,
      data: {},
      highlight: "",
    });
  });

  test("setHighlight", () => {
    const highlight = "test-highlight";

    expect(
      dataReducer(initialState, {
        type: "SET_HIGHLIGHT",
        highlight,
      }),
    ).toEqual({
      version: "v7.0",
      confidence: 50,
      data: {},
      highlight: "test-highlight",
    });
  });

  test("setSampleData", () => {
    expect(
      dataReducer(initialState, {
        type: "SET_SAMPLE_DATA",
      }),
    ).toEqual({
      version: "v5.9",
      confidence: 70,
      data: {
        "v5.9": { 70: {} as ConfidenceEntry },
      } as unknown as ComputedData,
      highlight: "sample-highlight",
    });
  });

  test("clearData", () => {
    expect(
      dataReducer(initialState, {
        type: "CLEAR_DATA",
      }),
    ).toEqual({
      data: {} as unknown as ContextData["data"],
      version: "" as ContextData["version"],
      confidence: "" as ContextData["confidence"],
      highlight: "",
    });
  });

  test("default", () => {
    expect(
      dataReducer(initialState, {
        // @ts-expect-error Testing default case
        type: "DEFAULT",
      }),
    ).toBe(initialState);
  });
});
