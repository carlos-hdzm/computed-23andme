import type { ComputedData } from "../types";
import { confidenceValues, versionValues } from "../constants/strings";

const getDataValues = (data: ComputedData) => {
    const availableVersions = getAvailableVersions(data);
    const selectedVersion = availableVersions[availableVersions.length - 1];
    const selectedConfidenceLevel = confidenceValues[selectedVersion][0];

    return {
        version: selectedVersion,
        confidence: selectedConfidenceLevel,
    }
};

const getAvailableVersions = (data: ComputedData) => {
    return versionValues.filter((version) => version in data);
}

export default getDataValues;
export { getAvailableVersions };