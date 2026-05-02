import type {
  ChromosomeHaplotype,
  ComputedData,
  ComputedDataV5Entry,
  ComputedDataV7Entry
} from "../types/objectTypes"

type ContextDataCommon = {
  data: ComputedData<ChromosomeHaplotype>
  highlight: string
}

type ContextDataV5 = {
  version: keyof ComputedData<ChromosomeHaplotype> & ('v5.2' | 'v5.9')
  confidence: keyof ComputedDataV5Entry<ChromosomeHaplotype>
}

type ContextDataV7 = {
  version: keyof ComputedData<ChromosomeHaplotype> & ('v7.0')
  confidence: keyof ComputedDataV7Entry<ChromosomeHaplotype>
}

export type ContextData = ContextDataCommon & (ContextDataV5 | ContextDataV7)

export type SetDataAction = {
  type: 'SET_DATA'
  data: ComputedData<ChromosomeHaplotype>
}

export type SetVersionAction = {
  type: 'SET_VERSION'
  version: keyof ComputedData<ChromosomeHaplotype>
}

export type SetConfidenceAction = {
  type: 'SET_CONFIDENCE'
  confidence: keyof (
    ComputedDataV5Entry<ChromosomeHaplotype> & 
    ComputedDataV7Entry<ChromosomeHaplotype>
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

export type VersionType = keyof ComputedData<ChromosomeHaplotype>
export type ConfidenceType =
  keyof (
    ComputedDataV5Entry<ChromosomeHaplotype> &
    ComputedDataV7Entry<ChromosomeHaplotype>
  )

export type DataAction =
  SetDataAction | 
  SetVersionAction | 
  SetConfidenceAction | 
  SetHighlightAction | 
  SetSampleDataAction | 
  ClearDataAction