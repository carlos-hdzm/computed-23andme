import { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { AppContext } from '../../context/context';
import type { ConfidenceEntry, SortedRegionsEntry } from '../../types';
import RegionRow from '../RegionRow/RegionRow';
import './Proportions.less';

export type ProportionsProps = {
  panelHidden?: boolean
}

const Proportions: React.FC<ProportionsProps> = ({ panelHidden = false }) => {
  const { data, version, confidence } = useContext(AppContext);
  const regions = useMemo(() => {
    if (!data || !version || !confidence) return [] as SortedRegionsEntry;
    // @ts-expect-error Different versions have different confidence types
    return (data[version][confidence] as ConfidenceEntry).regions;
  }, [data, version, confidence]);

  return (<section data-testid="proportions-panel" className={classNames('proportions', { 'panel-hidden': panelHidden })}>
    <table>
      <thead>
        <tr tabIndex={0}>
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