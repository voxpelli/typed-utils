import chai from 'chai';

import { ensureArray } from '../index.js';

chai.should();

describe('ensureArray', () => {
  it('should wrap non-array values in an array', () => {
    ensureArray('single').should.deep.equal(['single']);
    ensureArray(42).should.deep.equal([42]);
    ensureArray({ key: 'value' }).should.deep.equal([{ key: 'value' }]);
  });

  it('should return arrays as-is', () => {
    const arr = ['already', 'array'];
    ensureArray(arr).should.equal(arr);
    ensureArray([]).should.deep.equal([]);
    ensureArray([1, 2, 3]).should.deep.equal([1, 2, 3]);
  });

  it('should handle empty arrays', () => {
    ensureArray([]).should.deep.equal([]);
  });

  it('should preserve array identity', () => {
    const original = [1, 2, 3];
    const result = ensureArray(original);
    result.should.equal(original);
  });
});
