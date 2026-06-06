import { test, expect } from 'vitest';
import { createDataTemplate } from './createTemplates';

test('createDataTemplate should return a data template', () => {
  const template = createDataTemplate();
  expect(template).toMatchSnapshot();
});