import type { ChromosomeHaplotype, ComputedData } from '../types';
import type { ContextData } from './types';
import sampleData from '../assets/json/sample-data.json' with { type: 'json' };

const sampleContextData: ContextData = {
  version: 'v7.0',
  confidence: 50,
  data: sampleData as ComputedData<ChromosomeHaplotype>,
  highlight: '',
}

export default sampleContextData;