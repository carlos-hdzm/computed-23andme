import type { ChromosomeHaplotype, ChromosomeHaplotypeSplit, ChromosomesData, RegionsEntry, SortedRegionsEntry } from ".";
import type { confidenceValues, versionValues } from "../constants/strings";

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
> = Record<Exclude<ConfidenceLevel, "mostLikely">, ConfidenceEntry<T, U>>

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

export type ModelVersion = typeof versionValues[number]
export type ConfidenceLevel = typeof confidenceValues[ModelVersion][number]