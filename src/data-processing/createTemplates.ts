import type {
  ComputedDataV5Entry,
  ComputedDataV7Entry,
  ComputedData,
  ConfidenceEntry,
  ChromosomesData,
  AutosomalChromosomes,
  SexChromosomes,
  RegionsEntry,
  SortedRegionsEntry,
  ChromosomeHaplotype,
  ChromosomeHaplotypeSplit,
} from '../types';

const createChromosomesTemplate = <T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit>(): ChromosomesData<T> => ({
  autosomal: [] as unknown as AutosomalChromosomes<T>,
  sex: [[]] as unknown as SexChromosomes<T>,
});

const createConfidenceEntryTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): ConfidenceEntry<T, U> => ({
  regions: {} as U,
  chromosomes: createChromosomesTemplate(),
});

const createVersionTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): (ComputedDataV5Entry<T, U> & Omit<ComputedDataV7Entry<T, U>, 'mostLikely'>) => ({
  50: createConfidenceEntryTemplate(),
  60: createConfidenceEntryTemplate(),
  70: createConfidenceEntryTemplate(),
  80: createConfidenceEntryTemplate(),
  90: createConfidenceEntryTemplate(),
});

export const createDataTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): ComputedData<T, U> => ({
  'v5.2': createVersionTemplate(),
  'v5.9': createVersionTemplate(),
  'v7.0': {
    ...createVersionTemplate(),
    mostLikely: createConfidenceEntryTemplate(),
  },
});
