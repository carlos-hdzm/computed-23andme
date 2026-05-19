import React, { useCallback, useContext } from "react";
import classNames from "classnames";
import type { SortedRegionDataEntry, SortedRegionsEntry } from "../../types";
import './RegionRow.less';
import regionsStyles from '../../styles/regions.module.less';
import { AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";

type RegionRowProps = {
  regionName: string
  regionEntry: SortedRegionDataEntry
}

type MouseOverEvent = React.MouseEventHandler<HTMLTableRowElement>

const RegionRow: React.FC<RegionRowProps> = ({ regionEntry }) => {
  const dispatch = useContext(AppDispatchContext);
  const { depth, total: { proportion }, subregions, cssClass, label } = regionEntry;

  const handleRowMouseOver: MouseOverEvent = useCallback(() => {
    dispatch(contextActions.setHighlight(cssClass));
  }, [cssClass, dispatch]);

  const handleRowMouseOut: MouseOverEvent = useCallback(() => {
    dispatch(contextActions.setHighlight(''));
  }, [dispatch]);

  return (<>
    <tr
      className={classNames('region-row', `depth-${depth}`, regionsStyles[cssClass])}
      onMouseOver={handleRowMouseOver}
      onMouseOut={handleRowMouseOut}
    >
      <td className='region-name'>
        <div>{label}</div>
      </td>
      <td className='region-proportion'>{`${(proportion * 100).toFixed(2)}%`}</td>
    </tr>
    {
      subregions && (subregions as SortedRegionsEntry).map(([subregionName, subregionEntry]) => (
        <RegionRow key={subregionName} regionName={subregionName} regionEntry={subregionEntry} />
      ))
    }
  </>);
}

export default RegionRow