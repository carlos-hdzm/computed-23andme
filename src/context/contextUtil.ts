import type { ChromosomeHaplotype, ComputedData } from "../types";
import { confidenceValues, versionValues } from "../util/strings";

const getDataValues = (data: ComputedData<ChromosomeHaplotype>) => {
    const availableVersions = getAvailableVersions(data);
    const selectedVersion = availableVersions[availableVersions.length - 1];
    const selectedConfidenceLevel = confidenceValues[selectedVersion][0];

    return {
        version: selectedVersion,
        confidence: selectedConfidenceLevel,
    }
};

const getAvailableVersions = (data: ComputedData<ChromosomeHaplotype>) => {
    return versionValues.filter((version) => version in data);
}

export default getDataValues;
export { getAvailableVersions };