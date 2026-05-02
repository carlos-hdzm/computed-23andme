import { createEmptyProcessedData } from '../util/processedDataUtils.ts';
import type {
  ComputedDataEntry,
  ConfidenceEntry,
  NameRegExMatch,
  ChromosomeCopy,
  LabelSegmentRegExMatch,
  LabelProportionsRegExMatch,
  RegionsEntry,
  ChromosomeNumber,
  ComputedData,
  ComputedDataV5Entry,
  ComputedDataV7Entry,
  AutosomalChromosomes,
  SexChromosomes,
  RegionDataEntry,
  ChromosomeHaplotype,
  ChromosomeLengthObject,
  ChromosomeKey,
  ChromosomeOption,
} from '../types';
import regionMap from '../util/regionNesting.ts';
import chromosomesLengthsJSON from '../assets/json/chromosomes.json' with { type: 'json' };

const versionSmootherMap = {
  '45': 'v5.2' as const,
  '45_v2': 'v5.9' as const,
  '78': 'v7.0' as const,
}

type ModelVersion = 'v5.2' | 'v5.9' | 'v7.0'
type ConfidenceLevel = keyof (ComputedDataV5Entry<ChromosomeOption> & ComputedDataV7Entry<ChromosomeOption>)

const nameRegEx = /ap2_smoother_(45|78)_populations(_v2)?:(segments|proportions)_(([5-9]0)_percent_confidence|greedy_path_to_leaf)/;
const labelSegmentRegEx = /chr(\d\d?|X-npar)_hap([12])_(\d+)_(\d+)/;
const labelProportionRegEx = /population_proportions_([\w&-]+)_(hap[12]|total)_(\w+)/;

export const processData = (computedData: ComputedDataEntry[]) => {
  const processedData: ComputedData<ChromosomeCopy> = createEmptyProcessedData();

  for (const { label, name, data } of computedData) {
    const nameMatch = name.match(nameRegEx);
    if (nameMatch) {
      const labelMatchSegment = label.match(labelSegmentRegEx);
      const labelMatchProportion = label.match(labelProportionRegEx);
      if (!labelMatchSegment && !labelMatchProportion) continue;

      const [, version, v2, type, confidence, confidenceValue] = nameMatch as NameRegExMatch;
      const v = (v2 ? `${version}${v2}` : version) as keyof (typeof versionSmootherMap);
      const processedDataVersion = processedData[versionSmootherMap[v]];
      // @ts-expect-error Confidence Level varies by version
      const confidenceEntry = processedDataVersion[confidence === 'greedy_path_to_leaf' ? 'mostLikely' : confidenceValue] as ConfidenceEntry;
      if (type === 'segments' && labelMatchSegment) {
        const [, chromosome, haplotype, start, end] = labelMatchSegment as LabelSegmentRegExMatch;
        const chromosomes = confidenceEntry.chromosomes;
        let chromosomePair;
        if (chromosome === 'X-npar') {
          chromosomePair = chromosomes.sex;
        } else {
          const chromosomePairNumber = Number.parseInt(chromosome as ChromosomeNumber) - 1;
          const autosomalChromosomes = chromosomes.autosomal;
          if (!autosomalChromosomes[chromosomePairNumber]) {
            autosomalChromosomes[chromosomePairNumber] = [[], []] as unknown as [ChromosomeCopy, ChromosomeCopy];
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
        });
      } else if (type === 'proportions' && labelMatchProportion) {
        const [, region, haplotype, property] = labelMatchProportion as LabelProportionsRegExMatch;
        const regions = confidenceEntry.regions;
        if (!regions[region]) {
          regions[region] = { depth: 0 } as RegionDataEntry;
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
    }
  }
  return processedData;
}

const splitChromosomeCopy = (chromosomeCopy: ChromosomeCopy, index: number): ChromosomeHaplotype => {
  const chromosomeLengthObject = index === 23 ?
    (chromosomesLengthsJSON as ChromosomeLengthObject)['chrX-npar'] :
    (chromosomesLengthsJSON as ChromosomeLengthObject)[index.toString() as ChromosomeKey];

  const { centromere: [centromereMin, centromereMax] } = chromosomeLengthObject;
  const centromere = (centromereMin + centromereMax) / 2;

  let beforeCentromere = chromosomeCopy.filter(segment => segment.start < centromere);
  let afterCentromere = chromosomeCopy.filter(segment => segment.end > centromere);

  beforeCentromere = beforeCentromere.map(segment => {
    const newSegment = { ...segment };
    if (segment.end > centromere) newSegment.end = centromere;
    return newSegment;
  });
  afterCentromere = afterCentromere.map(segment => {
    const newSegment = { ...segment };
    if (segment.start < centromere) newSegment.start = centromere;
    return newSegment;
  });
  return [beforeCentromere, afterCentromere];
}

const nestRegionsChromosomes = (chromosomeCopy: ChromosomeCopy): ChromosomeCopy => {
  const nestedChromosomeCopy = [] as ChromosomeCopy;
  let prevSegment = chromosomeCopy[0];

  for (let i = 1; i < chromosomeCopy.length; i++) {
    const segment = chromosomeCopy[i];
    const { start: prevStart, depth: prevDepth } = prevSegment;
    const { start, end } = segment;

    if (start === prevStart) {
      segment.depth = prevDepth + 1;
      segment.cssClass = segment.region.replace(/_&_/g, '_');
      prevSegment.subsegments = [segment];
      nestedChromosomeCopy.push(prevSegment);
    } else {
      let topSegment = nestedChromosomeCopy[nestedChromosomeCopy.length - 1];
      let { end: topEnd, depth: topDepth } = topSegment;
      while (end > topEnd) {
        nestedChromosomeCopy.pop();
        topSegment = nestedChromosomeCopy[nestedChromosomeCopy.length - 1];
        ({ end: topEnd, depth: topDepth } = topSegment);
      }
      segment.depth = topDepth + 1;
      segment.cssClass = segment.region.replace(/_&_/g, '_');
      topSegment.subsegments!.push(segment);
    }

    prevSegment = segment;
  }

  const zeroDepthSegments = nestedChromosomeCopy.filter(segment => segment.depth === 0);
  zeroDepthSegments.forEach((segment) => {
    segment.cssClass = segment.region.replace(/_&_/g, '_');
  });
  return zeroDepthSegments;
}

const nestRegionsProportions = (regionsObject: RegionsEntry, version: ModelVersion): RegionsEntry => {
  const nestedRegions = {} as RegionsEntry;
  const regionMapVersion = regionMap[version];

  for (const region in regionsObject) {
    const regionObject = regionsObject[region];
    const { depth, label, ancestors = [] } = regionMapVersion[region]
    regionObject.depth = depth;
    regionObject.label = label;
    regionObject.cssClass = region.replace(/_&_/g, '_');

    let currentObject = nestedRegions;
    for (const ancestor of ancestors) {
      // @ts-expect-error This is a recursive type that TypeScript can't fully understand, but the logic is sound
      if (!(ancestor in currentObject)) currentObject[ancestor] = {}
      const ancestorObject = currentObject[ancestor]
      if (!('subregions' in ancestorObject)) ancestorObject.subregions = {}
      currentObject = ancestorObject.subregions!;
    }

    currentObject[region] = (region in currentObject) ? { ...currentObject[region], ...regionObject } : regionObject
  }

  return nestedRegions;
}

const confidenceLevelsByVersion: Record<ModelVersion, number> = {
  'v5.2': 5,
  'v5.9': 5,
  'v7.0': 6,
}

const validateAndCleanUpEntries = (processedData: ComputedData<ChromosomeOption>): void => {
  for (const version in processedData) {
    let missingConfidenceEntry = false,
      invalidChromosomeData = false,
      emptyChromosomeData = false,
      emptyRegionData = false;
    const processedDataVersion = processedData[version as ModelVersion]!;
    if (Object.keys(processedDataVersion).length !== confidenceLevelsByVersion[version as ModelVersion]) {
      missingConfidenceEntry = true;
    } else {
      for (const confidence in processedDataVersion) {
        // @ts-expect-error Confidence Level varies by version
        const confidenceEntry = processedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeOption>;
        if (confidenceEntry.regions && Object.keys(confidenceEntry.regions).length === 0) {
          emptyRegionData = true;
        }
        if (confidenceEntry.chromosomes) {
          const { autosomal, sex} = confidenceEntry.chromosomes;
          // @ts-expect-error On initialization, chromosomes.autosomal is an empty array, but with valid version entry, it should reach 22 entries
          if ((autosomal && autosomal.length === 0) &&
            (sex && sex.flat(Infinity).length === 0)) {
            emptyChromosomeData = true;
          } else if ((!autosomal || (autosomal.length > 0 && autosomal.length !== 22)) ||
            (!sex || sex.length > 2)) {
            invalidChromosomeData = true;
          }
        }
      }
    }
    if (!missingConfidenceEntry && emptyChromosomeData && emptyRegionData) {
      // No missing confidence entry, but empty chromosome and region data means the version is not in the data, so we delete it
      delete processedData[version as ModelVersion];
    } else if (missingConfidenceEntry || invalidChromosomeData || emptyRegionData) {
      // If there's anything missing, data is invalid
      throw new Error('Invalid data');
    }
  }
}

export const nestRegions = (processedData: ComputedData<ChromosomeCopy>) => {
  const nestedProcessedData: ComputedData<ChromosomeHaplotype> = createEmptyProcessedData();

  for (const version in processedData) {
    const processedDataVersion = processedData[version as ModelVersion];
    const nestedProcessedDataVersion = nestedProcessedData[version as ModelVersion];
    for (const confidence in processedDataVersion) {
      // @ts-expect-error Confidence Level varies by version
      const confidenceEntry = processedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeCopy>;
      // @ts-expect-error Confidence Level varies by version
      const nestedConfidenceEntry = nestedProcessedDataVersion[confidence as ConfidenceLevel] as ConfidenceEntry<ChromosomeHaplotype>;
      const chromosomes = confidenceEntry.chromosomes;
      const nestedChromosomes = nestedConfidenceEntry.chromosomes;
      nestedChromosomes.autosomal = chromosomes.autosomal.map((chromosomePair, index) => (
        chromosomePair.map(chromosomeCopy => {
          const [chromosomeCopy1, chromosomeCopy2] = splitChromosomeCopy(chromosomeCopy, index + 1);
          return [nestRegionsChromosomes(chromosomeCopy1), nestRegionsChromosomes(chromosomeCopy2)];
        }) as unknown as [ChromosomeCopy, ChromosomeCopy]
      )) as unknown as AutosomalChromosomes<ChromosomeHaplotype>;
      nestedChromosomes.sex = chromosomes.sex.map(chromosomeCopy => {
        const [chromosomeCopy1, chromosomeCopy2] = splitChromosomeCopy(chromosomeCopy, 23);
        const sexChromosomes = [nestRegionsChromosomes(chromosomeCopy1)];
        if (chromosomeCopy2) sexChromosomes.push(nestRegionsChromosomes(chromosomeCopy2));
        return sexChromosomes;
      }) as unknown as SexChromosomes<ChromosomeHaplotype>;

      nestedConfidenceEntry.regions = nestRegionsProportions(confidenceEntry.regions, version as ModelVersion);
    }
  }

  validateAndCleanUpEntries(nestedProcessedData);
  return nestedProcessedData;
}