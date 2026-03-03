/* eslint-disable unicorn/no-null */
import chai from 'chai';

import {
  filter,
  filterWithCallback,
  isArrayOfType,
  isStringArray,
  typesafeIsArray,
} from '../lib/array.js';

chai.should();

/**
 * @param {unknown} v
 * @returns {v is string}
 */
const isString = (v) => typeof v === 'string';

/**
 * @param {unknown} v
 * @returns {v is number}
 */
const isNumber = (v) => typeof v === 'number';

describe('array helpers', () => {
  describe('filter()', () => {
    it('should filter undefined by default', () => {
      /** @type {string[]} */
      const result = filter(['foo', undefined]);
      result.should.deep.equal(['foo']);
    });

    it('should filter explicit undefined', () => {
      /** @type {string[]} */
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = filter(['foo', undefined], undefined);
      result.should.deep.equal(['foo']);
    });

    it('should filter explicit null', () => {
      /** @type {string[]} */
      const result = filter(['foo', null], null);
      result.should.deep.equal(['foo']);
    });

    it('should filter explicit false', () => {
      const input = /** @type {const} */ (['foo', false]);
      /** @type {string[]} */
      const result = filter(input, false);
      result.should.deep.equal(['foo']);
    });

    it('should filter explicit string literal', () => {
      const input = /** @type {const} */ (['foo', false]);
      /** @type {false[]} */
      const result = filter(input, 'foo');
      result.should.deep.equal([false]);
    });

    it('should not filter anything but a single type at a time', () => {
      const input = /** @type {const} */ (['foo', undefined, null, false]);
      /** @type {(string|false|null)[]} */
      const result = filter(input);
      result.should.deep.equal(['foo', null, false]);
    });

    it('should not filter generic string', () => {
      /** @type {string} */
      const filterValue = 'bar';

      let result =
        // @ts-expect-error
        filter(['foo', 'bar'], filterValue);

      result.should.deep.equal(['foo']);

      // Should not result in error
      result = ['foo'];
    });
  });

  describe('filterWithCallback()', () => {
    it('should keep items matching the type guard', () => {
      filterWithCallback(['foo', 1, 'bar', null], isString).should.deep.equal(['foo', 'bar']);
    });

    it('should return empty array when no items match', () => {
      filterWithCallback(['foo', 'bar'], isNumber).should.deep.equal([]);
    });

    it('should return all items when all match', () => {
      filterWithCallback(['a', 'b', 'c'], isString).should.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('isArrayOfType()', () => {
    it('should return true when all elements match the type guard', () => {
      isArrayOfType(['foo', 'bar'], isString).should.be.ok;
      isArrayOfType([], isString).should.be.ok;
    });

    it('should return false when any element does not match', () => {
      isArrayOfType(['foo', 1], isString).should.not.be.ok;
    });

    it('should return false for non-array values', () => {
      isArrayOfType('not an array', isString).should.not.be.ok;
      isArrayOfType(null, isString).should.not.be.ok;
    });
  });

  describe('typesafeIsArray()', () => {
    it('should return true for arrays', () => {
      typesafeIsArray([]).should.be.ok;
      typesafeIsArray([1, 2, 3]).should.be.ok;
    });

    it('should return false for non-array values', () => {
      typesafeIsArray('string').should.not.be.ok;
      typesafeIsArray(null).should.not.be.ok;
      typesafeIsArray({}).should.not.be.ok;
      typesafeIsArray(42).should.not.be.ok;
    });
  });

  describe('isStringArray()', () => {
    it('should return true for arrays of strings', () => {
      isStringArray(['foo', 'bar']).should.be.ok;
      isStringArray([]).should.be.ok;
    });

    it('should return false for mixed arrays', () => {
      isStringArray(['foo', 1]).should.not.be.ok;
      isStringArray(['foo', null]).should.not.be.ok;
    });

    it('should return false for non-array values', () => {
      isStringArray('string').should.not.be.ok;
      isStringArray(null).should.not.be.ok;
    });
  });
});
