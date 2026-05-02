import type {
  ComputedDataV5Entry,
  ComputedDataV7Entry,
  ComputedData,
  ConfidenceEntry,
  ChromosomesData,
  AutosomalChromosomes,
  SexChromosomes,
  RegionsEntry,
  ChromosomeOption,
} from '../types';

const createChromosomesTemplate = <T extends ChromosomeOption>(): ChromosomesData<T> => ({
  autosomal: [] as unknown as AutosomalChromosomes<T>,
  sex: [[]] as unknown as SexChromosomes<T>,
});

const createConfidenceEntryTemplate = <T extends ChromosomeOption>(): ConfidenceEntry<T> => ({
  regions: {} as RegionsEntry,
  chromosomes: createChromosomesTemplate(),
});

const createVersionTemplate = <T extends ChromosomeOption>(): (ComputedDataV5Entry<T> & Omit<ComputedDataV7Entry<T>, 'mostLikely'>) => ({
  50: createConfidenceEntryTemplate(),
  60: createConfidenceEntryTemplate(),
  70: createConfidenceEntryTemplate(),
  80: createConfidenceEntryTemplate(),
  90: createConfidenceEntryTemplate(),
});

export const createEmptyProcessedData = <T extends ChromosomeOption>(): ComputedData<T> => ({
  'v5.2': createVersionTemplate(),
  'v5.9': createVersionTemplate(),
  'v7.0': {
    ...createVersionTemplate(),
    mostLikely: createConfidenceEntryTemplate(),
  },
});
