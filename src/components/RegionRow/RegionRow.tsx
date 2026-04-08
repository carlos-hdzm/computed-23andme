import React, { useCallback, useContext } from "react";
import classNames from "classnames";
import type { RegionDataEntry } from "../../types";
import sortSubregionsByProportion from "../../util/sortSubregions";
import './RegionRow.less';
import regionsStyles from '../../styles/regions.module.less';
import { AppDispatchContext } from "../../context/context";

type RegionRowProps = {
  regionName: string
  regionEntry: RegionDataEntry
}

type MouseOverEvent = React.MouseEventHandler<HTMLTableRowElement>

const RegionRow: React.FC<RegionRowProps> = ({ regionEntry }) => {
  const dispatch = useContext(AppDispatchContext);
  const { depth, total: { proportion }, subregions, cssClass, label } = regionEntry;

  const handleRowMouseOver: MouseOverEvent = useCallback(() => {
    dispatch({ type: 'SET_HIGHLIGHT', highlight: cssClass });
  }, [cssClass, dispatch]);

  const handleRowMouseOut: MouseOverEvent = useCallback(() => {
    dispatch({ type: 'SET_HIGHLIGHT', highlight: '' });
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
      subregions && sortSubregionsByProportion(subregions, { containsBroadly: true }).map(([subregionName, subregionEntry]) => (
        <RegionRow key={subregionName} regionName={subregionName} regionEntry={subregionEntry} />
      ))
    }
  </>);
}

export default RegionRow