import type { ComputedData, ContextData } from "../types";

const getSampleContextData = async () => {
  const { default: sampleData } =
    (await import("../../assets/json/sample-data.json")) as unknown as {
      default: ComputedData;
    };

  return {
    version: "v7.0",
    confidence: "mostLikely",
    data: sampleData,
    highlight: "",
  } as ContextData;
};

export default getSampleContextData;
