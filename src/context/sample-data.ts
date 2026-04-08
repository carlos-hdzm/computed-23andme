import type { ChromosomeHaplotype, ComputedData } from '../types';
import type { ContextData } from './reducer';

export const sampleData: ContextData = {
  version: 'v7.0',
  confidence: 50,
  data: {} as ComputedData<ChromosomeHaplotype>,
  highlight: '',
}