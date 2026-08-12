import React from "react";
import classNames from "classnames";
import type { ChromosomeHaplotypeSplit } from "../../types";
import './ChromosomePair.less';
import Chromosome from "../Chromosome/Chromosome";

type AutosomalChromosomePairProps = {
  label: number
  isSexPair: false
  pair: [ChromosomeHaplotypeSplit, ChromosomeHaplotypeSplit]
}

type SexChromosomePairProps = {
  label?: never
  isSexPair: true
  pair: [ChromosomeHaplotypeSplit] | [ChromosomeHaplotypeSplit, ChromosomeHaplotypeSplit]
}

export type ChromosomePairProps = AutosomalChromosomePairProps | SexChromosomePairProps

const ChromosomePair: React.FC<ChromosomePairProps> = ({ label, isSexPair, pair }) => {
  const rowSpan = isSexPair ? pair.length : 2;
  // Y chromosome should be render for sex pairs with only 1 element
  const shouldRenderYChromosome = rowSpan === 1;
  // For autosomal chromosome pairs, the index is the chromosome number
  // For sex pairs, only the X chromosome uses the index
  const chromosomeIndex = isSexPair ? 'X' : label;

  return (<>
    <tr>
      <td rowSpan={rowSpan} className='chromosome-label'>{chromosomeIndex}</td>
      <td className={classNames('chromosome-segments', 'hap1')}>
        <Chromosome chromosome={pair[0]} label={chromosomeIndex} />
      </td>
    </tr>
    <tr>
      {shouldRenderYChromosome && (<td className='chromosome-label'>Y</td>)}
      <td className={classNames('chromosome-segments', 'hap2')}>
        {shouldRenderYChromosome ?
          <Chromosome label='Y' /> :
          <Chromosome chromosome={pair[1]} label={chromosomeIndex} />
        }
      </td>
    </tr></>)
};

export default ChromosomePair;