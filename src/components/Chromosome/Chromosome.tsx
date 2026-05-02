import React, { useMemo } from 'react';
import type { ChromosomeHaplotype, ChromosomeKey, ChromosomeLengthObject } from '../../types';
import './Chromosome.less';
import chromosomesLengthsJSON from '../../assets/json/chromosomes.json';
import ChromosomeSegment from "../ChromosomeSegment/ChromosomeSegment";

type ChromosomeProps = {
  chromosome?: ChromosomeHaplotype
  label: number | 'X' | 'Y'
}

const longestLength = (chromosomesLengthsJSON as ChromosomeLengthObject)['1' as ChromosomeKey].length;

const Chromosome: React.FC<ChromosomeProps> = React.memo(({ chromosome, label }) => {
  const isYChromosome = label === 'Y';
  const chrKey = typeof label === 'number' ? (label.toString() as ChromosomeKey) : (`chr${label}-npar` as ChromosomeKey);
  const { length, centromere: [centromereMin, centromereMax] } = chromosomesLengthsJSON[chrKey];
  const chrWidth = label === 1 ? '100%' : `${100 * (length / longestLength)}%`;
  const centromerePos = (centromereMin + centromereMax) / 2;
  const [arm1, arm2] = isYChromosome ? [null, null] : chromosome!;
  const firstSegmentStart = useMemo(() => {
    if (arm1?.[0]) return arm1[0].start;
    if (arm2?.[0]) return arm2[0].start;
    return Number.NaN;
  }, [arm1, arm2]);

  return (<div className='haplotype' style={{
    width: chrWidth,
  }}>
    <div className='arm' style={{
      flexBasis: `${100 * (centromerePos / length)}%`,
      ...((firstSegmentStart < centromerePos) ? { paddingLeft: `${100 * firstSegmentStart / centromerePos}%` } : {}),
    }}>
      {arm1 && arm1.map((segment, index) => (
        <ChromosomeSegment
          key={index}
          segment={segment}
          parentLength={(firstSegmentStart < centromerePos) ? (centromerePos - firstSegmentStart) : centromerePos}
        />
      ))}
    </div>
    <div className='arm' style={{
      flexBasis: `${100 * ((length - centromerePos) / length)}%`,
      ...((firstSegmentStart > centromerePos) ? { paddingLeft: `${100 * (firstSegmentStart - centromerePos) / (length - centromerePos)}%` } : {}),
    }}>
      {arm2 && arm2.map((segment, index) => (
        <ChromosomeSegment
          key={index}
          segment={segment}
          parentLength={(firstSegmentStart > centromerePos) ? ((length - centromerePos) - firstSegmentStart) : (length - centromerePos)}
        />
      ))}
    </div>
  </div>);
});

export default Chromosome;