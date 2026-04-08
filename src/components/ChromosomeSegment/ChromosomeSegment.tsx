import classNames from "classnames";
import type { ChromosomeSegment as ChromosomeSegmentType } from "../../types";
import './ChromosomeSegment.less'
import regionsStyles from '../../styles/regions.module.less';
import { useContext } from "react";
import { AppContext } from "../../context/context";

type ChromosomeSegmentProps = {
  segment: ChromosomeSegmentType
  parentLength: number
}

const ChromosomeSegment: React.FC<ChromosomeSegmentProps> = ({ segment, parentLength }) => {
  const { highlight } = useContext(AppContext);
  const { start, end, cssClass, depth, subsegments } = segment;

  const isHighlightMode = highlight !== '';
  const isHighlighted = isHighlightMode && highlight === cssClass;
  const isDimmed = isHighlightMode && highlight !== cssClass;

  return <div
    className={classNames(
      'segment', regionsStyles[cssClass],
      {
        highlight: isHighlighted,
        dimmed: isDimmed
      }
    )}
    style={{
      flexBasis: `${100 * (end - start) / parentLength}%`,
      zIndex: depth,
    }}>
    {subsegments && subsegments.map((subsegment, index) => <ChromosomeSegment key={index} segment={subsegment} parentLength={end - start} />)}
  </div>
};

export default ChromosomeSegment;