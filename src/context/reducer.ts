import type { ContextData, DataAction } from "../types";
import sampleContextData from "./sample-data";

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
    case 'SET_SAMPLE_DATA':
      return {
        ...state,
        ...sampleContextData,
      };
    case 'CLEAR_DATA':
      return {
        ...state,
        data: {} as unknown as ContextData['data'],
        version: '' as ContextData['version'],
        confidence: '' as ContextData['confidence'],
        highlight: '',
      };
    default:
      return state;
  }
}