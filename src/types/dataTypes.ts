import type { ChromosomeHaplotype, ChromosomeHaplotypeSplit, ChromosomesData, RegionsEntry, SortedRegionsEntry } from ".";

export type ConfidenceEntry<
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
> = {
  regions: U
  chromosomes: ChromosomesData<T>
}

export type ComputedDataV5Entry<
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
> = Record<50 | 60 | 70 | 80 | 90, ConfidenceEntry<T, U>>

export type ComputedDataV7Entry<
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
> = ComputedDataV5Entry<T, U> & {
  mostLikely: ConfidenceEntry<T, U>
}

export type ComputedData<
  T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit,
  U extends RegionsEntry = SortedRegionsEntry
> = {
  'v5.2'?: ComputedDataV5Entry<T, U>
  'v5.9'?: ComputedDataV5Entry<T, U>
  'v7.0'?: ComputedDataV7Entry<T, U>
}

export type ModelVersion = 'v5.2' | 'v5.9' | 'v7.0'
export type ConfidenceLevel = keyof (ComputedDataV5Entry<ChromosomeHaplotype, RegionsEntry> & ComputedDataV7Entry<ChromosomeHaplotype, RegionsEntry>)