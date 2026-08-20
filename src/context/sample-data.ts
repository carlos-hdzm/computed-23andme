import type { ComputedData, ContextData } from '../types';
import sampleData from '../../assets/json/sample-data.json' with { type: 'json' };

const sampleContextData: ContextData = {
  version: 'v7.0',
  confidence: 'mostLikely',
  data: sampleData as unknown as ComputedData,
  highlight: '',
}

export default sampleContextData;