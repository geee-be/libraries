import { expect } from 'vitest';
import { given } from './index.js';

given(
  'it is set up',
  () => 1,
  (when, then) => {
    when('something is triggered', (num) => {
      then('number is what it should be', () => {
        expect(num).to.eql(1);
      });
    });
  },
);
