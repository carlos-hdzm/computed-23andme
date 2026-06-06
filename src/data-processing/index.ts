import csv from 'csvtojson';
import type { ComputedDataEntry } from '../types';
import { populateDataTemplate } from './populateDataTemplate';
import { nestRegions } from './processData';

const processCSVString = async (csvStr: string) => {
  try {
    const json = await csv().fromString(csvStr) as ComputedDataEntry[];
    const processedData = populateDataTemplate(json);
    return nestRegions(processedData);
  } catch (error) {
    throw new Error(`Error processing CSV data: ${error instanceof Error ? error.message : error}`);
  }
}

export default processCSVString;