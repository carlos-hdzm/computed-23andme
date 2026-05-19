import regions from '../../assets/json/regions.json' with { type: 'json' };
import type { ModelVersion, Region, RegionParentMap, RegionParentMapVersion, Regions } from '../types';

const regionMap = {
  'v5.2': {},
  'v5.9': {},
  'v7.0': {},
} as RegionParentMap;

const parseRegions = (currentRegion: Region, regionMapVersion: RegionParentMapVersion, ancestorRegions?: string[]): void => {
  const { name, depth, label, children } = currentRegion;
  regionMapVersion[name] = {
    depth,
    label,
    ...(ancestorRegions ? { ancestors: ancestorRegions } : {}),
  };
  if (children?.length) children.forEach((childRegion) => parseRegions(childRegion, regionMapVersion, [...(ancestorRegions || []), name]));
}

for (const version in (regions as Regions)) {
  const regionMapVersion = regionMap[version as ModelVersion];
  const regionVersion = regions[version as ModelVersion];
  parseRegions(regionVersion, regionMapVersion);
}

export default regionMap;

