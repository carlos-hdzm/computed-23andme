import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/context';
import type { ConfidenceEntry } from '../../types';
import RegionRow from '../RegionRow/RegionRow';
import './Proportions.less';

const Proportions = () => {
  const { data, version, confidence } = useContext(AppContext);
  const regions = useMemo(() => {
    if (!data || !version || !confidence) return [];
    // @ts-expect-error Different versions have different confidence types
    return (data[version][confidence] as ConfidenceEntry).regions;
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