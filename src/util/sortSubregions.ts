import type { RegionDataEntry, RegionsEntry } from "../types";

const sortSubregionsByProportion = (subregions: RegionsEntry, { containsUnassigned = false, containsBroadly = false }): [string, RegionDataEntry][] => {
  let subregionsToSort = Object.entries(subregions);
  let broadlyRegion = '';
  if (containsUnassigned) {
    subregionsToSort = subregionsToSort.filter(([regionName]) => regionName !== 'unassigned');
  } else if (containsBroadly) {
    subregionsToSort = subregionsToSort.filter(([regionName]) => {
      if (regionName.startsWith('broadly')) {
        broadlyRegion = regionName;
        return false;
      } else return true;
    });
  }

  const sortedSubregions = subregionsToSort.sort(([, regionA], [, regionB]) => {
    const { total: { proportion: totalA } } = regionA;
    const { total: { proportion: totalB } } = regionB;
    return totalB - totalA;
  });
  if (containsUnassigned) sortedSubregions.push(['unassigned', subregions.unassigned]);
  if (containsBroadly && broadlyRegion) sortedSubregions.push([broadlyRegion, subregions[broadlyRegion]]);

  return sortedSubregions;
};

export default sortSubregionsByProportion;