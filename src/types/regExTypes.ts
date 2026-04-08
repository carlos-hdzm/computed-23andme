import { type ProportionsEntry } from ".";

type NameRegExMatchType = RegExpMatchArray & {
  3: 'segments' | 'proportions' // type
}

type NameRegExMatchGreedy = {
  4: 'greedy_path_to_leaf' // greedy path
}

type NameRegExMatchConfValue = {
  4: '50_percent_confidence'
  5: '50'
} | {
  4: '60_percent_confidence'
  5: '60'
} | {
  4: '70_percent_confidence'
  5: '70'
} | {
  4: '80_percent_confidence'
  5: '80'
} | {
  4: '90_percent_confidence'
  5: '90'
}

type NameRegExMatchV5 = {
  1: '45' // smoother version 45
  2: 'v2' | undefined
} & NameRegExMatchType & NameRegExMatchConfValue

type NameRegExMatchV7 = {
  1: '78' // smoother version 78
} & NameRegExMatchType & (NameRegExMatchConfValue | NameRegExMatchGreedy)

export type NameRegExMatch = NameRegExMatchV5 | NameRegExMatchV7

export type ChromosomeNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | 'X-npar';

export type LabelSegmentRegExMatch = RegExpMatchArray & {
  1: ChromosomeNumber // chromosome
  2: '1' | '2' // haplotype
  3: string // start position
  4: string // end position
}

export type LabelProportionsRegExMatch = RegExpMatchArray & {
  1: string // region
  2: 'hap1' | 'hap2' | 'total' // haplotype
  3: keyof ProportionsEntry // value
}