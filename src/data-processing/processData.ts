import { createDataTemplate } from './createTemplates.ts';
import type {
  ConfidenceEntry,
  ChromosomeHaplotypeNoSplit,
  ChromosomeArm,
  ComputedData,
  AutosomalChromosomes,
  SexChromosomes,
  ChromosomeHaplotypeSplit,
  ModelVersion,
  ConfidenceLevel,
  UnsortedRegionsEntry,
  SortedRegionsEntry,
} from '../types/index.ts';
import { nestRegionsChromosomes, nestRegionsProportions, splitChromosomeCopy } from './shapeData.ts';
import sortSubregionsByProportion from './sortSubregions.ts';
import { validateAndCleanUpEntries } from './validateProcessedData.ts';

const sortSubregions = (subregions: UnsortedRegionsEntry): SortedRegionsEntry => {
  const sortedSubregions = sortSubregionsByProportion(subregions, { containsBroadly: true });
  return sortedSubregions.map(([regionName, subregionEntry]) => {
    const newSubregionEntry = {
      ...subregionEntry,
    };
    if (subregionEntry.subregions) {
      newSubregionEntry.subregions = sortSubregions(subregionEntry.subregions as UnsortedRegionsEntry);
    }
    return [regionName, newSubregionEntry];
  });
}

const sortRegions = (regions: UnsortedRegionsEntry): SortedRegionsEntry => {
  const subregions = ('world' in regions) ? regions.world.subregions : /* v8 ignore next -- @preserve */ regions;
  const sortedRegions = sortSubregionsByProportion(subregions!, { containsUnassigned: 'unassigned' in subregions! });
  
  return sortedRegions.map(([regionName, regionEntry]) => {
    const newRegionEntry = {
      ...regionEntry,
    };
    if (regionEntry.subregions) {
      newRegionEntry.subregions = sortSubregions(regionEntry.subregions as UnsortedRegionsEntry);
    }
    return [regionName, newRegionEntry];
  }) as typeof sortedRegions;
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
        /* v8 ignore else -- @preserve */
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