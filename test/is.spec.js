import { describe, it } from 'mocha';
import chai from 'chai';

import { isKeyWithValue } from '../lib/is.js';

const { expect } = chai;

describe('is', () => {
  describe('isKeyWithValue()', () => {
    it('should return true when key exists with matching value', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'foo', 'bar')).to.equal(true);
      expect(isKeyWithValue({ num: 123 }, 'num', 123)).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'baz', 'bar')).to.equal(false);
    });

    it('should return false when key exists but has wrong value', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'foo', 'baz')).to.equal(false);
    });
  });
});
