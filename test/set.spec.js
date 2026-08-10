import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FrozenSet } from '../lib/set.js';

describe('set helpers', () => {
  describe('FrozenSet', () => {
    it('should work', () => {
      /** @type {FrozenSet<string>} */
      let result;

      assert.doesNotThrow(() => {
        result = new FrozenSet(['abc', '123']);
      });

      assert.throws(() => {
        // @ts-ignore
        result.add('xyz');
      });

      assert.throws(() => {
        // @ts-ignore
        result.delete('abc');
      });

      assert.throws(() => {
        // @ts-ignore
        result.clear();
      });
    });
  });
});
