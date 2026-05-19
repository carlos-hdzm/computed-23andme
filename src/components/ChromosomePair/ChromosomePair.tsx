import React from "react";
import type { ChromosomeHaplotypeSplit } from "../../types";
import './ChromosomePair.less';
import Chromosome from "../Chromosome/Chromosome";
import classNames from "classnames";

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

type ChromosomePairProps = AutosomalChromosomePairProps | SexChromosomePairProps

const ChromosomePair: React.FC<ChromosomePairProps> = ({ label, isSexPair, pair }) => {
  const rowSpan = isSexPair ? pair.length : 2;

  return (<>
    <tr>
      <td rowSpan={rowSpan} className='chromosome-label'>{isSexPair ? 'X' : label}</td>
      <td className={classNames('chromosome-segments', 'hap1')}>
        <Chromosome chromosome={pair[0]} label={isSexPair ? 'X' : label} />
      </td>
    </tr>
    <tr>
      {rowSpan === 1 && (<td className='chromosome-label'>Y</td>)}
      <td className={classNames('chromosome-segments', 'hap2')}>
        {isSexPair ?
          <Chromosome label='Y' /> :
          <Chromosome chromosome={pair[1]} label={label} />
        }
      </td>
    </tr></>)
};

export default ChromosomePair;