type FixedLengthReadOnlyArray<N extends number, T> = {
  0: T;
  length: N;
} & ReadonlyArray<T> // Ensure fixed length, excluding push and other length-mutating methods

export type FixedSizeArray<N extends number, T> =
  FixedLengthReadOnlyArray<N, T> &
  // Let elements be re-assigned
  { -readonly [P in keyof FixedLengthReadOnlyArray<N, T>]: FixedLengthReadOnlyArray<N, T>[P] }