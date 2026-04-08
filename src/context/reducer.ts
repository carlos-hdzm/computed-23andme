import type { ChromosomeHaplotype, ComputedData, ComputedDataV5Entry, ComputedDataV7Entry } from "../types/objectTypes"

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

type SetDataAction = {
  type: 'SET_DATA'
  data: ComputedData<ChromosomeHaplotype>
}

type SetVersionAction = {
  type: 'SET_VERSION'
  version: keyof ComputedData<ChromosomeHaplotype>
}

type SetConfidenceAction = {
  type: 'SET_CONFIDENCE'
  confidence: keyof (ComputedDataV5Entry<ChromosomeHaplotype> & ComputedDataV7Entry<ChromosomeHaplotype>)
}

type SetHighlightAction = {
  type: 'SET_HIGHLIGHT'
  highlight: string
}

export type VersionType = keyof ComputedData<ChromosomeHaplotype>
export type ConfidenceType = keyof (ComputedDataV5Entry<ChromosomeHaplotype> & ComputedDataV7Entry<ChromosomeHaplotype>)

export type DataAction = SetDataAction | SetVersionAction | SetConfidenceAction | SetHighlightAction

export const dataReducer = (state: ContextData, action: DataAction) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.data };
    case 'SET_VERSION':
      return { ...state, version: action.version };
    case 'SET_CONFIDENCE':
      return { ...state, confidence: action.confidence };
    case 'SET_HIGHLIGHT':
      return { ...state, highlight: action.highlight };
    default:
      return state;
  }
}