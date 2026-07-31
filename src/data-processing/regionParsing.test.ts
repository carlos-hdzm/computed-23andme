import { test, expect } from 'vitest';
import regionMap from './regionParsing';

test('regionParsing should return the nested region map', () => {
  expect(regionMap).toMatchSnapshot();
});