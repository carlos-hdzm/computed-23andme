export type ProportionsEntry = {
  proportion: number
  cm_proportion: number
  length: number
  length_cm: number
}

export type UnsortedRegionDataEntry = {
  label: string
  cssClass: string
  hap1?: ProportionsEntry
  hap2?: ProportionsEntry
  total: ProportionsEntry
  depth: number
  subregions?: UnsortedRegionsEntry
}

export type SortedRegionDataEntry = {
  label: string
  cssClass: string
  hap1?: ProportionsEntry
  hap2?: ProportionsEntry
  total: ProportionsEntry
  depth: number
  subregions?: RegionsEntry
}

export type RegionDataEntry = UnsortedRegionDataEntry | SortedRegionDataEntry

export type UnsortedRegionsEntry = Record<string, UnsortedRegionDataEntry>
export type SortedRegionsEntry = [string, SortedRegionDataEntry][]
export type RegionsEntry = UnsortedRegionsEntry | SortedRegionsEntry