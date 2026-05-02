import csv from 'csvtojson';
import type { ComputedDataEntry } from '../types';
import { nestRegions, processData } from './processData';

const processCSVString = async (csvStr: string) => {
  try {
    const json = await csv().fromString(csvStr) as ComputedDataEntry[];
    const processedData = processData(json);
    return nestRegions(processedData);
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
    throw error;
  }
}

export default processCSVString;