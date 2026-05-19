import type { UnsortedRegionsEntry, SortedRegionsEntry } from "../types";

const sortSubregionsByProportion = (subregions: UnsortedRegionsEntry, { containsUnassigned = false, containsBroadly = false }): SortedRegionsEntry => {
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
  }) as SortedRegionsEntry;
  if (containsUnassigned) sortedSubregions.push(['unassigned', subregions.unassigned]);
  if (containsBroadly && broadlyRegion) sortedSubregions.push([broadlyRegion, subregions[broadlyRegion]]);

  return sortedSubregions;
};

export default sortSubregionsByProportion;