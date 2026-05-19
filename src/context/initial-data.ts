import type { ChromosomeHaplotypeSplit, ComputedData, ComputedDataV5Entry, ComputedDataV7Entry } from '../types';
import type { ContextData } from './types';

// @ts-expect-error Different versions have different confidence types
export const initialData = (): ContextData => ({
  version: '' as keyof ComputedData,
  confidence: '' as keyof (ComputedDataV5Entry<ChromosomeHaplotypeSplit> & ComputedDataV7Entry<ChromosomeHaplotypeSplit>),
  data: {} as unknown as ComputedData,
  highlight: '',
})