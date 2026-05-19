import { createDataTemplate } from './createTemplates.ts';
import type {
  ConfidenceEntry,
  ChromosomeHaplotypeNoSplit,
  ChromosomeArm,
  ComputedData,
  AutosomalChromosomes,
  SexChromosomes,
  ChromosomeHaplotypeSplit,
  ChromosomeHaplotype,
  ModelVersion,
  ConfidenceLevel,
  UnsortedRegionsEntry,
  SortedRegionsEntry,
} from '../types/index.ts';
import { nestRegionsChromosomes, nestRegionsProportions, splitChromosomeCopy } from './shapeData.ts';
import sortSubregionsByProportion from './sortSubregions.ts';

const confidenceLevelsByVersion: Record<ModelVersion, number> = {
  'v5.2': 5,
  'v5.9': 5,
  'v7.0': 6,
}

const validateAndCleanUpEntries = (processedData: ComputedData<ChromosomeHaplotype>): void => {
  for (const version in processedData) {
    let missingConfidenceEntry = false,
      invalidChromosomeData = false,
      emptyChromosomeData = false,
      emptyRegionData = false;
    const processedDataVersion = processedData[version as ModelVersion]!;
    if (Object.keys(processedDataVersion).length !== confidenceLevelsByVersion[version as ModelVersion]) {
      missingConfidenceEntry = true;
    } else {
      for (const confidence in processedDataVersion) {
        // @ts-expect-error Confidence Level varies by version
        const confidenceEntry = processedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeHaplotype>;
        if (confidenceEntry.regions && Object.keys(confidenceEntry.regions).length === 0) {
          emptyRegionData = true;
        }
        if (confidenceEntry.chromosomes) {
          const { autosomal, sex } = confidenceEntry.chromosomes;
          // @ts-expect-error On initialization, chromosomes.autosomal is an empty array, but with valid version entry, it should reach 22 entries
          if ((autosomal && autosomal.length === 0) &&
            (sex && sex.flat(Infinity).length === 0)) {
            emptyChromosomeData = true;
          } else if ((!autosomal || (autosomal.length > 0 && autosomal.length !== 22)) ||
            (!sex || sex.length > 2)) {
            invalidChromosomeData = true;
          }
        }
      }
    }
    if (!missingConfidenceEntry && emptyChromosomeData && emptyRegionData) {
      // No missing confidence entry, but empty chromosome and region data means the version is not in the data, so we delete it
      delete processedData[version as ModelVersion];
    } else if (missingConfidenceEntry || invalidChromosomeData || emptyRegionData) {
      // If there's anything missing, data is invalid
      throw new Error('Invalid data');
    }
  }
}

const sortSubregions = (subregions: UnsortedRegionsEntry): SortedRegionsEntry => {
  const sortedSubregions = sortSubregionsByProportion(subregions, { containsBroadly: true });
  sortedSubregions.forEach(([, subregionEntry]) => {
    if (subregionEntry.subregions) {
      subregionEntry.subregions = sortSubregions(subregionEntry.subregions as UnsortedRegionsEntry);
    }
  });
  return sortedSubregions;
}

const sortRegions = (regions: UnsortedRegionsEntry): SortedRegionsEntry => {
  const subregions = ('world' in regions) ? regions.world.subregions : regions;
  const sortedRegions = sortSubregionsByProportion(subregions!, { containsUnassigned: 'unassigned' in subregions! });
  sortedRegions.forEach(([, regionEntry]) => {
    if (regionEntry.subregions) {
      regionEntry.subregions = sortSubregions(regionEntry.subregions as UnsortedRegionsEntry);
    }
  });
  return sortedRegions;
}

export const nestRegions = (processedData: ComputedData<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>) => {
  const nestedProcessedData: ComputedData = createDataTemplate();

  for (const version in processedData) {
    const processedDataVersion = processedData[version as ModelVersion];
    const nestedProcessedDataVersion = nestedProcessedData[version as ModelVersion];
    for (const confidence in processedDataVersion) {
      // @ts-expect-error Confidence Level varies by version
      const confidenceEntry = processedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>;
      // @ts-expect-error Confidence Level varies by version
      const nestedConfidenceEntry = nestedProcessedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeHaplotypeSplit>;
      const chromosomes = confidenceEntry.chromosomes;
      const nestedChromosomes = nestedConfidenceEntry.chromosomes;
      nestedChromosomes.autosomal = chromosomes.autosomal.map((chromosomePair, index) => (
        chromosomePair.map(chromosomeCopy => {
          const [chromosomeCopy1, chromosomeCopy2] = splitChromosomeCopy(chromosomeCopy, index + 1);
          return [nestRegionsChromosomes(chromosomeCopy1), nestRegionsChromosomes(chromosomeCopy2)];
        }) as unknown as [ChromosomeArm, ChromosomeArm]
      )) as unknown as AutosomalChromosomes<ChromosomeHaplotypeSplit>;
      nestedChromosomes.sex = chromosomes.sex.map(chromosomeCopy => {
        const [chromosomeCopy1, chromosomeCopy2] = splitChromosomeCopy(chromosomeCopy, 23);
        const sexChromosomes = [nestRegionsChromosomes(chromosomeCopy1)];
        if (chromosomeCopy2) sexChromosomes.push(nestRegionsChromosomes(chromosomeCopy2));
        return sexChromosomes;
      }) as unknown as SexChromosomes<ChromosomeHaplotypeSplit>;

      const nestedRegions = nestRegionsProportions(confidenceEntry.regions, version as ModelVersion);
      nestedConfidenceEntry.regions = sortRegions(nestedRegions);
    }
  }

  validateAndCleanUpEntries(nestedProcessedData);
  return nestedProcessedData;
}