import type {
  ConfidenceEntry,
  ComputedData,
  ModelVersion,
  ConfidenceLevel,
} from '../types/index.ts';
import { confidenceValues } from '../constants/strings.ts';

const confidenceLevelsByVersion = (() => {
  const levelsByVersion = {} as Record<ModelVersion, string[]>;
  for (const version in confidenceValues) {
    levelsByVersion[version as ModelVersion] = confidenceValues[version as ModelVersion].map(String);
  }
  return levelsByVersion;
})();

const areConfidenceLevelsEqual = (levels1: string[], levels2: string[]) => {
  if (levels1.length !== levels2.length) return false;

  const sortedLevels1 = levels1.toSorted();
  const sortedLevels2 = levels2.toSorted();

  return sortedLevels1.every((level, index) => level === sortedLevels2[index]);
}

interface DataErrors {
  invalidChromosomeData?: boolean
  emptyChromosomeData?: boolean
  emptyRegionData?: boolean
}

type ConfidenceEntryError = {
  [C in ConfidenceLevel]: DataErrors
}

interface VersionError extends ConfidenceEntryError {
  missingConfidenceEntry?: boolean
}

type ValidationErrorType = Record<ModelVersion, VersionError>

const isVersionUnavailable = (versionErrorObject: VersionError) => {
  const { missingConfidenceEntry, ...confidenceEntries } = versionErrorObject;

  if (missingConfidenceEntry) return false;

  return Object.values(confidenceEntries).every(({ emptyChromosomeData, emptyRegionData }) => emptyChromosomeData && emptyRegionData);
}

const isDataInvalid = (versionErrorObject: VersionError) => {
  const { missingConfidenceEntry, ...confidenceEntries } = versionErrorObject;

  if (missingConfidenceEntry) return true;

  return Object.values(confidenceEntries).some(({ invalidChromosomeData, emptyChromosomeData, emptyRegionData }) => invalidChromosomeData || emptyChromosomeData || emptyRegionData);
}

export const validateAndCleanUpEntries = (processedData: ComputedData): void => {
  const errorObject = {} as ValidationErrorType;

  for (const version in processedData) {
    /* v8 ignore else -- @preserve */
    if (!(version in errorObject)) errorObject[version as ModelVersion] = {} as VersionError;
    const versionErrorObject = errorObject[version as ModelVersion];

    const processedDataVersion = processedData[version as ModelVersion]!;
    if (!areConfidenceLevelsEqual(Object.keys(processedDataVersion), confidenceLevelsByVersion[version as ModelVersion])) {
      versionErrorObject.missingConfidenceEntry = true;
    } else {
      for (const confidence in processedDataVersion) {
        /* v8 ignore else -- @preserve */
        if (!(confidence in versionErrorObject)) versionErrorObject[confidence as ConfidenceLevel] = {} as DataErrors;
        const confidenceErrorObject = versionErrorObject[confidence as ConfidenceLevel];

        // @ts-expect-error Confidence Level varies by version
        const confidenceEntry = processedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry;
        if (confidenceEntry.regions && confidenceEntry.regions.length === 0) {
          confidenceErrorObject.emptyRegionData = true;
        }
        /* v8 ignore else -- @preserve */
        if (confidenceEntry.chromosomes) {
          const { autosomal, sex } = confidenceEntry.chromosomes;
          // @ts-expect-error On initialization, chromosomes.autosomal is an empty array, but with valid version entry, it should have 22 entries
          if ((autosomal && autosomal.length === 0) &&
            (sex && sex.flat(Infinity).length === 0)) {
            confidenceErrorObject.emptyChromosomeData = true;
          } else if ((!autosomal || (autosomal.length > 0 && autosomal.length !== 22)) ||
            (!sex || sex.length > 2)) {
            confidenceErrorObject.invalidChromosomeData = true;
          }
        }
      }
    }

    if (isVersionUnavailable(versionErrorObject)) {
      // No missing confidence entry, but empty chromosome and region data means the version is not in the data, so we delete it
      delete processedData[version as ModelVersion];
    } else if (isDataInvalid(versionErrorObject)) {
      // If there's anything missing, data is invalid
      throw new Error('Invalid data');
    }
  }
}