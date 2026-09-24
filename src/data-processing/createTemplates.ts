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

const createChromosomesTemplate = <T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit>(): ChromosomesData<T> => {
  const chromosomesTemplate = Object.create(null);
  chromosomesTemplate.autosomal = [] as unknown as AutosomalChromosomes<T>;
  chromosomesTemplate.sex = [[]] as unknown as SexChromosomes<T>;
  return chromosomesTemplate;
};

const createConfidenceEntryTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): ConfidenceEntry<T, U> => {
  const confidenceEntryTemplate = Object.create(null);
  confidenceEntryTemplate.regions = Object.create(null) as U;
  confidenceEntryTemplate.chromosomes = createChromosomesTemplate<T>();
  return confidenceEntryTemplate;
};

const createVersionTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): (ComputedDataV5Entry<T, U> & Omit<ComputedDataV7Entry<T, U>, 'mostLikely'>) => {
  const versionTemplate = Object.create(null);
  versionTemplate[50] = createConfidenceEntryTemplate();
  versionTemplate[60] = createConfidenceEntryTemplate();
  versionTemplate[70] = createConfidenceEntryTemplate();
  versionTemplate[80] = createConfidenceEntryTemplate();
  versionTemplate[90] = createConfidenceEntryTemplate();
  return versionTemplate;
};

export const createDataTemplate = <
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
>(): ComputedData<T, U> => {
  const dataTemplate = Object.create(null);
  dataTemplate['v5.2'] = createVersionTemplate();
  dataTemplate['v5.9'] = createVersionTemplate();
  dataTemplate['v7.0'] = Object.assign(Object.create(null), createVersionTemplate());
  dataTemplate['v7.0'].mostLikely = createConfidenceEntryTemplate();
  return dataTemplate;
};
