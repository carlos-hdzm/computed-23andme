export type FixedSizeArray<N extends number, T> = N extends 0 ? never[] : {
  0: T;
  length: N;
} & T[]

export type ComputedDataEntry = {
  "ISO country code": string
  "chromosome": string
  "confidence": string
  "data": string
  "end": string
  "end cm": string
  "geo key": string
  "historical individual": string
  "label": string
  "name": string
  "number of grandparents": string
  "number of relatives": string
  "start": string
  "start cm": string
  "subregion id": string
  "time created": string
}

export type ProportionsEntry = {
  proportion: number
  cm_proportion: number
  length: number
  length_cm: number
}

export type RegionDataEntry = {
  label: string
  cssClass: string
  hap1?: ProportionsEntry
  hap2?: ProportionsEntry
  total: ProportionsEntry
  depth: number
  subregions?: RegionsEntry
}

export type RegionsEntry = Record<string, RegionDataEntry>

export type ChromosomeSegment = {
  start: number
  end: number
  region: string
  depth: number
  cssClass: string
  subsegments?: ChromosomeSegment[]
}

export type ChromosomeCopy = ChromosomeSegment[]

export type ChromosomeHaplotype = [ChromosomeCopy, ChromosomeCopy]

export type ChromosomeOption = ChromosomeCopy | ChromosomeHaplotype

export type AutosomalChromosomes<T extends ChromosomeOption> = FixedSizeArray<22, [T, T]>

export type SexChromosomes<T extends ChromosomeOption> = [T] | [T, T]

export type ChromosomesData<T extends ChromosomeOption> = {
  autosomal: AutosomalChromosomes<T>
  sex: SexChromosomes<T>
}

export type ConfidenceEntry<T extends ChromosomeOption> = {
  regions: RegionsEntry
  chromosomes: ChromosomesData<T>
}

export type ComputedDataV5Entry<T extends ChromosomeOption> = Record<50 | 60 | 70 | 80 | 90, ConfidenceEntry<T>>

export type ComputedDataV7Entry<T extends ChromosomeOption> = ComputedDataV5Entry<T> & {
  mostLikely: ConfidenceEntry<T>
}

export type ComputedData<T extends ChromosomeOption> = {
  'v5.2'?: ComputedDataV5Entry<T>
  'v5.9'?: ComputedDataV5Entry<T>
  'v7.0'?: ComputedDataV7Entry<T>
}

export type ChromosomeKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | 'chrX-npar' | 'chrY-npar' | 'MT';
export type ChromosomeLengthObject = Record<
  ChromosomeKey,
  {
    length: number,
    centromere: [number, number]
  }
>