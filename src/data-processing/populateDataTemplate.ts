import { createDataTemplate } from './createTemplates';
import { populateSegmentData, populateProportionData } from './populateDataTemplate-util';
import type {
  ComputedDataEntry,
  ConfidenceEntry,
  NameRegExMatch,
  ChromosomeHaplotypeNoSplit,
  ComputedData,
  UnsortedRegionsEntry,
} from '../types/index.ts';

const versionSmootherMap = {
  '45': 'v5.2' as const,
  '45_v2': 'v5.9' as const,
  '78': 'v7.0' as const,
}

const nameRegEx = /ap2_smoother_(45|78)_populations(_v2)?:(segments|proportions)_(([5-9]0)_percent_confidence|greedy_path_to_leaf)/;

export const populateDataTemplate = (computedData: ComputedDataEntry[]) => {
  const dataTemplate: ComputedData<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry> = createDataTemplate();

  for (const { label, name, data } of computedData) {
    const nameMatch = name.match(nameRegEx);
    if (!nameMatch) continue; 

    const [, version, v2, type, confidence, confidenceValue] = nameMatch as NameRegExMatch;
    const v = (v2 ? `${version}${v2}` : version) as keyof (typeof versionSmootherMap);
    const dataTemplateVersion = dataTemplate[versionSmootherMap[v]];
    // @ts-expect-error Confidence Level varies by version
    const confidenceEntry = dataTemplateVersion[confidence === 'greedy_path_to_leaf' ? 'mostLikely' : confidenceValue] as ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>;

    if (type === 'segments') {
      populateSegmentData(label, confidenceEntry, data);
    } else if (type === 'proportions') {
      populateProportionData(label, confidenceEntry, data);
    }
  }
  
  return dataTemplate;
}
