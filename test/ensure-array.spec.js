import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ensureArray } from '../index.js';

describe('ensureArray', () => {
  it('should wrap non-array values in an array', () => {
    assert.deepStrictEqual(ensureArray('single'), ['single']);
    assert.deepStrictEqual(ensureArray(42), [42]);
    assert.deepStrictEqual(ensureArray({ key: 'value' }), [{ key: 'value' }]);
  });

  it('should return arrays as-is', () => {
    const arr = ['already', 'array'];
    assert.strictEqual(ensureArray(arr), arr);
    assert.deepStrictEqual(ensureArray([]), []);
    assert.deepStrictEqual(ensureArray([1, 2, 3]), [1, 2, 3]);
  });

  it('should handle empty arrays', () => {
    assert.deepStrictEqual(ensureArray([]), []);
  });

  it('should preserve array identity', () => {
    const original = [1, 2, 3];
    const result = ensureArray(original);
    assert.strictEqual(result, original);
  });
});
