import regions from '../assets/json/regions.json' with { type: 'json' };

type Region = {
  name: string
  label: string
  depth: number
  children?: Region[]
}

type Regions = {
  'v5.2': Region
  'v5.9': Region
  'v7.0': Region
}

type RegionParentMapEntry = {
  depth: number
  label: string
  ancestors?: string[]
}

type RegionParentMapVersion = Record<string, RegionParentMapEntry>

type RegionParentMap = {
  'v5.2': RegionParentMapVersion
  'v5.9': RegionParentMapVersion
  'v7.0': RegionParentMapVersion
}

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
  const regionMapVersion = regionMap[version as ('v5.2' | 'v7.0')];
  const regionVersion = regions[version as ('v5.2' | 'v7.0')];
  parseRegions(regionVersion, regionMapVersion);
}

export default regionMap;

