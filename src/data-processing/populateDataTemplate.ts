import { createDataTemplate } from './createTemplates.ts';
import type {
  ComputedDataEntry,
  ConfidenceEntry,
  NameRegExMatch,
  ChromosomeHaplotypeNoSplit,
  LabelSegmentRegExMatch,
  LabelProportionsRegExMatch,
  ChromosomeNumber,
  ComputedData,
  UnsortedRegionDataEntry,
  ChromosomeSegment,
  UnsortedRegionsEntry,
} from '../types/index.ts';

const versionSmootherMap = {
  '45': 'v5.2' as const,
  '45_v2': 'v5.9' as const,
  '78': 'v7.0' as const,
}

const nameRegEx = /ap2_smoother_(45|78)_populations(_v2)?:(segments|proportions)_(([5-9]0)_percent_confidence|greedy_path_to_leaf)/;
const labelSegmentRegEx = /chr(\d\d?|X-npar)_hap([12])_(\d+)_(\d+)/;
const labelProportionRegEx = /population_proportions_([\w&-]+)_(hap[12]|total)_(\w+)/;

const populateSegmentData = (label: string, confidenceEntry: ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>, data: string) => {
  const labelMatchSegment = label.match(labelSegmentRegEx);
  if (!labelMatchSegment) return;

  const [, chromosome, haplotype, start, end] = labelMatchSegment as LabelSegmentRegExMatch;
  const chromosomes = confidenceEntry.chromosomes;
  let chromosomePair;
  if (chromosome === 'X-npar') {
    chromosomePair = chromosomes.sex;
  } else {
    const chromosomePairNumber = Number.parseInt(chromosome as ChromosomeNumber) - 1;
    const autosomalChromosomes = chromosomes.autosomal;
    if (!autosomalChromosomes[chromosomePairNumber]) {
      autosomalChromosomes[chromosomePairNumber] = [[], []] as unknown as [ChromosomeHaplotypeNoSplit, ChromosomeHaplotypeNoSplit];
    }
    chromosomePair = autosomalChromosomes[chromosomePairNumber];
  }

  const hapIndex = Number.parseInt(haplotype) - 1;
  if (!chromosomePair[hapIndex]) {
    chromosomePair[hapIndex] = [];
  }

  chromosomePair[hapIndex].push({
    start: Number.parseInt(start),
    end: Number.parseInt(end),
    region: data,
    depth: 0,
  } as ChromosomeSegment);
}

const populateProportionData = (label: string, confidenceEntry: ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>, data: string) => {
  const labelMatchProportion = label.match(labelProportionRegEx);
  if (!labelMatchProportion) return;

  const [, region, haplotype, property] = labelMatchProportion as LabelProportionsRegExMatch;
  const regions = confidenceEntry.regions;
  if (!regions[region]) {
    regions[region] = { depth: 0 } as UnsortedRegionDataEntry;
  }

  const regionDataEntry = regions[region];

  if (!regionDataEntry[haplotype]) {
    regionDataEntry[haplotype] = {
      proportion: 0,
      cm_proportion: 0,
      length: 0,
      length_cm: 0,
    }
  }

  regionDataEntry[haplotype][property] = Number.parseFloat(data);
}

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