import type { ChromosomeHaplotype, ComputedData, ComputedDataV5Entry, ComputedDataV7Entry } from '../types';
import type { ContextData } from './types';

// @ts-expect-error Different versions have different confidence types
export const initialData = (): ContextData => ({
  version: '' as keyof ComputedData<ChromosomeHaplotype>,
  confidence: '' as keyof (ComputedDataV5Entry<ChromosomeHaplotype> & ComputedDataV7Entry<ChromosomeHaplotype>),
  data: {} as unknown as ComputedData<ChromosomeHaplotype>,
  highlight: '',
})