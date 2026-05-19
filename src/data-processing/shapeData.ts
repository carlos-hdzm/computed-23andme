import type {
  ChromosomeHaplotypeNoSplit,
  ChromosomeArm,
  UnsortedRegionsEntry,
  ChromosomeHaplotypeSplit,
  ChromosomeLengthObject,
  ChromosomeKey,
  ModelVersion,
} from '../types/index.ts';
import regionMap from './regionParsing.ts';
import chromosomesLengthsJSON from '../../assets/json/chromosomes.json' with { type: 'json' };

export const splitChromosomeCopy = (chromosomeCopy: ChromosomeHaplotypeNoSplit, index: number): ChromosomeHaplotypeSplit => {
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

export const nestRegionsChromosomes = (chromosomeCopy: ChromosomeArm): ChromosomeArm => {
  const nestedChromosomeCopy = [] as ChromosomeArm;
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

export const nestRegionsProportions = (regionsObject: UnsortedRegionsEntry, version: ModelVersion): UnsortedRegionsEntry => {
  const nestedRegions = {} as UnsortedRegionsEntry;
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