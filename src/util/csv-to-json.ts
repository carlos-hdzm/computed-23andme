'use strict';
import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';

async function convertCSVToJSON<T extends Record<string, string>>(csvSource: string): Promise<T[]> {
  try {
    const jsonArray = await csv().fromFile(csvSource);
    return jsonArray;
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
    throw error;
  }
}

type OverwriteJSONParamsType = {
  overwrite?: boolean;
  callback?: (...args: any[]) => any;
}

async function readJSONFile(jsonFilePath: string, { overwrite, callback }: OverwriteJSONParamsType = { overwrite: false }, ...args: any[]): Promise<any> {
  let jsonData: any;
  if ((overwrite || !fs.existsSync(jsonFilePath) && (typeof callback === 'function'))) {
    jsonData = await callback(...args);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`Generated JSON file at ${path.relative(process.cwd(), jsonFilePath)}`);
  } else if (fs.existsSync(jsonFilePath)) {
    console.log(`JSON file already exists at ${path.relative(process.cwd(), jsonFilePath)}`);
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  } else {
    throw new Error(`JSON file does not exist: ${path.relative(process.cwd(), jsonFilePath)}`);
  }
  return jsonData;
}

async function csvToJSONFile(csvFilePath: string, jsonFilePath: string, overwrite = false) {
  const jsonData = await readJSONFile(jsonFilePath, { overwrite, callback: convertCSVToJSON }, csvFilePath);
  return jsonData;
}

export {
  convertCSVToJSON,
  readJSONFile,
  csvToJSONFile,
};