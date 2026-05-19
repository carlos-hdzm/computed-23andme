import type {
  ChromosomeHaplotypeSplit,
  ComputedData,
  ComputedDataV5Entry,
  ComputedDataV7Entry
} from "../types/dataTypes"

type ContextDataCommon = {
  data: ComputedData
  highlight: string
}

type ContextDataV5 = {
  version: keyof ComputedData & ('v5.2' | 'v5.9')
  confidence: keyof ComputedDataV5Entry<ChromosomeHaplotypeSplit>
}

type ContextDataV7 = {
  version: keyof ComputedData & ('v7.0')
  confidence: keyof ComputedDataV7Entry<ChromosomeHaplotypeSplit>
}

export type ContextData = ContextDataCommon & (ContextDataV5 | ContextDataV7)

export type SetDataAction = {
  type: 'SET_DATA'
  data: ComputedData
}

export type SetVersionAction = {
  type: 'SET_VERSION'
  version: keyof ComputedData
}

export type SetConfidenceAction = {
  type: 'SET_CONFIDENCE'
  confidence: keyof (
    ComputedDataV5Entry<ChromosomeHaplotypeSplit> & 
    ComputedDataV7Entry<ChromosomeHaplotypeSplit>
  )
}

export type SetHighlightAction = {
  type: 'SET_HIGHLIGHT'
  highlight: string
}

export type SetSampleDataAction = {
  type: 'SET_SAMPLE_DATA'
}

export type ClearDataAction = {
  type: 'CLEAR_DATA'
}

export type VersionType = keyof ComputedData
export type ConfidenceType =
  keyof (
    ComputedDataV5Entry<ChromosomeHaplotypeSplit> &
    ComputedDataV7Entry<ChromosomeHaplotypeSplit>
  )

export type DataAction =
  SetDataAction | 
  SetVersionAction | 
  SetConfidenceAction | 
  SetHighlightAction | 
  SetSampleDataAction | 
  ClearDataAction