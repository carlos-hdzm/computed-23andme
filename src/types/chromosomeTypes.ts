import type { FixedSizeArray } from "."

export type ChromosomeSegment = {
  start: number
  end: number
  region: string
  depth: number
  cssClass: string
  subsegments?: ChromosomeSegment[]
}

export type ChromosomeHaplotypeNoSplit = ChromosomeSegment[]

export type ChromosomeArm = ChromosomeHaplotypeNoSplit

export type ChromosomeHaplotypeSplit = [ChromosomeArm, ChromosomeArm]

export type ChromosomeHaplotype = ChromosomeHaplotypeNoSplit | ChromosomeHaplotypeSplit

export type AutosomalChromosomes<T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit> = FixedSizeArray<22, [T, T]>

export type SexChromosomes<T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit> = [T] | [T, T]

export type ChromosomesData<T extends ChromosomeHaplotype = ChromosomeHaplotypeSplit> = {
  autosomal: AutosomalChromosomes<T>
  sex: SexChromosomes<T>
}

export type AutosomalChromosomesKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22';
export type ChromosomeKey = AutosomalChromosomesKey | 'chrX-npar' | 'chrY-npar' | 'MT';
export type ChromosomeLengthObject = Record<
  ChromosomeKey,
  {
    length: number,
    centromere: [number, number]
  }
>