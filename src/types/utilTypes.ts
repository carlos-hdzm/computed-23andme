// Inspired by https://www.npmjs.com/package/fixed-size-array by https://github.com/mstn
// Modified to allow re-assignment of elements, while still preventing length mutation
type FixedLengthReadOnlyArray<N extends number, T> = {
  0: T;
  length: N;
} & ReadonlyArray<T> // Ensure fixed length, excluding push and other length-mutating methods

export type FixedSizeArray<N extends number, T> =
  FixedLengthReadOnlyArray<N, T> &
  // Let elements be re-assigned
  { -readonly [P in keyof FixedLengthReadOnlyArray<N, T>]: FixedLengthReadOnlyArray<N, T>[P] }