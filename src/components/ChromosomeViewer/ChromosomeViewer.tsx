import { useContext, useMemo } from 'react';
import './ChromosomeViewer.less'
import { AppContext } from '../../context/context';
import type { ChromosomeHaplotypeSplit, ChromosomesData, ConfidenceEntry } from '../../types';
import ChromosomePair from '../ChromosomePair/ChromosomePair';

const ChromosomeViewer = () => {
  const { data, version, confidence } = useContext(AppContext);
  const chromosomes: ChromosomesData<ChromosomeHaplotypeSplit> = useMemo(() => {
    if (!data || !version || !confidence) return { autosomal: [], sex: [] } as unknown as ChromosomesData<ChromosomeHaplotypeSplit>;
    // @ts-expect-error Different versions have different confidence types
    return (data[version][confidence] as ConfidenceEntry).chromosomes as ChromosomesData<ChromosomeHaplotypeSplit>;
  }, [data, version, confidence]);

  return (<section className='chromosome-viewer'>
    <table>
      <tbody>
        {
          chromosomes.autosomal.map((chromosomePair, index) => (
            <ChromosomePair key={index} label={index + 1} isSexPair={false} pair={chromosomePair} />
          ))
        }
        <ChromosomePair isSexPair={true} pair={chromosomes.sex} />
      </tbody>
    </table>
  </section>);
};

export default ChromosomeViewer;