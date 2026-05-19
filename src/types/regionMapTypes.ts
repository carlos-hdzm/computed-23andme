import type { ModelVersion } from "."

export type Region = {
  name: string
  label: string
  depth: number
  children?: Region[]
}

export type Regions = Record<ModelVersion, Region>

type RegionParentMapEntry = {
  depth: number
  label: string
  ancestors?: string[]
}

export type RegionParentMapVersion = Record<string, RegionParentMapEntry>

export type RegionParentMap = Record<ModelVersion, RegionParentMapVersion>