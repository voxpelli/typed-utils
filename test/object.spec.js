import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { omit, pick } from '../lib/object.js';

const referenceObject = Object.freeze({
  abc: 123,
  def: 456,
  xyz: 789,
});

describe('object helpers', () => {
  describe('omit()', () => {
    it('should omit specified keys', () => {
      const result = omit(referenceObject, ['abc', 'xyz']);

      assert.deepStrictEqual(result, { def: 456 });
    });

    it('should return a new object', () => {
      const result = omit(referenceObject, []);

      assert.deepStrictEqual(result, referenceObject);
      assert.notStrictEqual(result, referenceObject);
    });
  });

  describe('pick()', () => {
    it('should pick specified keys', () => {
      const result = pick(referenceObject, ['abc', 'xyz']);

      assert.deepStrictEqual(result, { abc: 123, xyz: 789 });
    });

    it('should return a new object', () => {
      const result = pick(referenceObject, ['abc', 'def', 'xyz']);

      assert.deepStrictEqual(result, referenceObject);
      assert.notStrictEqual(result, referenceObject);
    });
  });
});
