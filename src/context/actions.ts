import type {
  ComputedData,
  ConfidenceLevel,
  ModelVersion,
  SetDataAction,
  SetVersionAction,
  SetConfidenceAction,
  SetHighlightAction,
  SetSampleDataAction,
  ClearDataAction,
} from "../types";

const contextActions = {
  setData(data: ComputedData): SetDataAction {
    return { type: "SET_DATA", data };
  },
  setVersion(version: ModelVersion): SetVersionAction {
    return { type: "SET_VERSION", version };
  },
  setConfidence(confidence: ConfidenceLevel): SetConfidenceAction {
    return { type: "SET_CONFIDENCE", confidence };
  },
  setHighlight(highlight: string): SetHighlightAction {
    return { type: "SET_HIGHLIGHT", highlight };
  },
  setSampleData(): SetSampleDataAction {
    return { type: "SET_SAMPLE_DATA" };
  },
  clearData(): ClearDataAction {
    return { type: "CLEAR_DATA" };
  },
};

export default contextActions;
