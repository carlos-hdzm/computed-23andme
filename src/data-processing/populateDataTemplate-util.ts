import type {
  ConfidenceEntry,
  ChromosomeHaplotypeNoSplit,
  LabelSegmentRegExMatch,
  LabelProportionsRegExMatch,
  ChromosomeNumber,
  UnsortedRegionDataEntry,
  ChromosomeSegment,
  UnsortedRegionsEntry,
} from '../types/index.ts';

const labelSegmentRegEx = /chr([1-9]|1[0-9]|2[0-2]|X-npar)_hap([12])_(\d+)_(\d+)/;
const labelProportionRegEx = /population_proportions_([\w&-]+)_(hap[12]|total)_(\w+)/;

export const populateSegmentData = (label: string, confidenceEntry: ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>, data: string) => {
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

export const populateProportionData = (label: string, confidenceEntry: ConfidenceEntry<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>, data: string) => {
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
