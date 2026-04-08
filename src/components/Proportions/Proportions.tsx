import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/context';
import type { ConfidenceEntry } from '../../types';
import RegionRow from '../RegionRow/RegionRow';
import sortSubregionsByProportion from '../../util/sortSubregions';
import './Proportions.less';

const Proportions = () => {
  const { data, version, confidence } = useContext(AppContext);
  const regions = useMemo(() => {
    // @ts-ignore
    const regionsObject = (data[version][confidence] as ConfidenceEntry).regions;
    const subregions = ('world' in regionsObject) ? regionsObject.world.subregions : regionsObject;
    return sortSubregionsByProportion(subregions!, { containsUnassigned: 'unassigned' in subregions! });
  }, [data, version, confidence]);

  return (<section className='proportions'>
    <table>
      <thead>
        <tr>
          <th>World</th>
          <th>100%</th>
        </tr>
      </thead>
      <tbody>
        {regions.map(([regionName, regionEntry]) => (
          <RegionRow key={regionName} regionName={regionName} regionEntry={regionEntry} />
        ))}
      </tbody>
    </table>
  </section>);
};

export default Proportions;