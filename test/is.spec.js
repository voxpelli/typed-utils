/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import chai from 'chai';
import { describe, it } from 'mocha';

import {
  isArrayOfLiteralType,
  isKeyWithType,
  isKeyWithValue,
  isObjectWithKey,
  isObjectValueType,
  isOptionalKeyWithType,
  isPropertyKey,
} from '../lib/is.js';

const { expect } = chai;

describe('is', () => {
  describe('isObjectWithKey()', () => {
    it('should return true when key exists on object', () => {
      expect(isObjectWithKey({ foo: 'bar' }, 'foo')).to.equal(true);
      expect(isObjectWithKey({ foo: undefined }, 'foo')).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isObjectWithKey({ foo: 'bar' }, 'baz')).to.equal(false);
      expect(isObjectWithKey({}, 'foo')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isObjectWithKey(null, 'foo')).to.equal(false);
      expect(isObjectWithKey(undefined, 'foo')).to.equal(false);
      expect(isObjectWithKey('string', 'foo')).to.equal(false);
      expect(isObjectWithKey(123, 'foo')).to.equal(false);
    });
  });

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

  describe('isKeyWithType()', () => {
    it('should return true when key exists with matching type', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.equal(true);
      expect(isKeyWithType({ num: 42 }, 'num', 'number')).to.equal(true);
      expect(isKeyWithType({ flag: true }, 'flag', 'boolean')).to.equal(true);
      expect(isKeyWithType({ arr: [] }, 'arr', 'array')).to.equal(true);
      expect(isKeyWithType({ obj: {} }, 'obj', 'object')).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.equal(false);
    });

    it('should return false when key exists but type does not match', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'foo', 'number')).to.equal(false);
      expect(isKeyWithType({ num: 42 }, 'num', 'string')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isKeyWithType(null, 'foo', 'string')).to.equal(false);
      expect(isKeyWithType('string', 'foo', 'string')).to.equal(false);
    });
  });

  describe('isKeyWithType() with array of types', () => {
    it('should return true when value matches any allowed type', () => {
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string', 'number'])).to.equal(true);
      expect(isKeyWithType({ x: 42 }, 'x', ['string', 'number'])).to.equal(true);
      expect(isKeyWithType({ x: true }, 'x', ['boolean', 'number'])).to.equal(true);
    });

    it('should return false when value matches none of the allowed types', () => {
      expect(isKeyWithType({ x: true }, 'x', ['string', 'number'])).to.equal(false);
      expect(isKeyWithType({ x: 'hello' }, 'x', ['number', 'boolean'])).to.equal(false);
    });

    it('should work with single-element array', () => {
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string'])).to.equal(true);
      expect(isKeyWithType({ x: 42 }, 'x', ['string'])).to.equal(false);
    });

    it('should return false for key not in object', () => {
      expect(isKeyWithType({ x: 'hello' }, 'y', ['string', 'number'])).to.equal(false);
    });

    it('should return false when object is not an object', () => {
      expect(isKeyWithType(undefined, 'x', ['string', 'number'])).to.equal(false);
      expect(isKeyWithType('not an object', 'x', ['string', 'number'])).to.equal(false);
    });

    it('should work with null as an allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);
      // eslint-disable-next-line unicorn/no-null
      expect(isKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
    });
  });

  describe('isArrayOfLiteralType()', () => {
    it('should return true for arrays with all elements of correct type', () => {
      expect(isArrayOfLiteralType(['foo', 'bar', 'baz'], 'string')).to.equal(true);
      expect(isArrayOfLiteralType([1, 2, 3], 'number')).to.equal(true);
      expect(isArrayOfLiteralType([true, false], 'boolean')).to.equal(true);
      expect(isArrayOfLiteralType([[], [1], [2, 3]], 'array')).to.equal(true);
    });

    it('should return true for empty arrays', () => {
      expect(isArrayOfLiteralType([], 'string')).to.equal(true);
      expect(isArrayOfLiteralType([], 'number')).to.equal(true);
    });

    it('should return false when array contains element of wrong type', () => {
      expect(isArrayOfLiteralType(['foo', 123, 'bar'], 'string')).to.equal(false);
      expect(isArrayOfLiteralType([1, 2, 'three'], 'number')).to.equal(false);
    });

    it('should return false for non-array values', () => {
      expect(isArrayOfLiteralType('not an array', 'string')).to.equal(false);
      // eslint-disable-next-line unicorn/no-null
      expect(isArrayOfLiteralType(null, 'string')).to.equal(false);
      expect(isArrayOfLiteralType(undefined, 'string')).to.equal(false);
    });
  });

  describe('isArrayOfLiteralType() with array of types', () => {
    it('should return true for arrays with elements matching any allowed type', () => {
      expect(isArrayOfLiteralType(['foo', 123, 'bar'], ['string', 'number'])).to.equal(true);
      expect(isArrayOfLiteralType([1, 'two', 3], ['string', 'number'])).to.equal(true);
      expect(isArrayOfLiteralType([true, 42, 'test'], ['boolean', 'number', 'string'])).to.equal(true);
    });

    it('should return false when array contains element not matching any allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isArrayOfLiteralType(['foo', null], ['string', 'number'])).to.equal(false);
      expect(isArrayOfLiteralType([1, undefined], ['string', 'boolean'])).to.equal(false);
    });
  });

  describe('isObjectValueType()', () => {
    it('should return true for objects with all values of correct type', () => {
      expect(isObjectValueType({ a: 'foo', b: 'bar' }, 'string')).to.equal(true);
      expect(isObjectValueType({ x: 1, y: 2, z: 3 }, 'number')).to.equal(true);
      expect(isObjectValueType({ flag1: true, flag2: false }, 'boolean')).to.equal(true);
    });

    it('should return true for empty objects', () => {
      expect(isObjectValueType({}, 'string')).to.equal(true);
      expect(isObjectValueType({}, 'number')).to.equal(true);
    });

    it('should return false when object contains value of wrong type', () => {
      expect(isObjectValueType({ a: 'foo', b: 123 }, 'string')).to.equal(false);
      expect(isObjectValueType({ x: 1, y: 'two' }, 'number')).to.equal(false);
    });

    it('should return false for non-object values', () => {
      expect(isObjectValueType('string', 'string')).to.equal(false);
      // eslint-disable-next-line unicorn/no-null
      expect(isObjectValueType(null, 'string')).to.equal(false);
      expect(isObjectValueType(123, 'string')).to.equal(false);
    });
  });

  describe('isObjectValueType() with array of types', () => {
    it('should return true for objects with values matching any allowed type', () => {
      expect(isObjectValueType({ a: 'foo', b: 123, c: true }, ['string', 'number', 'boolean'])).to.equal(true);
      expect(isObjectValueType({ x: 1, y: 'two' }, ['string', 'number'])).to.equal(true);
      expect(isObjectValueType({ flag: true, count: 42 }, ['boolean', 'number'])).to.equal(true);
    });

    it('should return false when object contains value not matching any allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isObjectValueType({ a: 'foo', b: null }, ['string', 'number'])).to.equal(false);
      expect(isObjectValueType({ x: 1, y: undefined }, ['string', 'boolean'])).to.equal(false);
    });
  });

  describe('isOptionalKeyWithType()', () => {
    it('should return true when key is absent', () => {
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.equal(true);
      expect(isOptionalKeyWithType({}, 'foo', 'string')).to.equal(true);
    });

    it('should return true when key is present but undefined', () => {
      expect(isOptionalKeyWithType({ foo: undefined }, 'foo', 'string')).to.equal(true);
    });

    it('should return true when key is present with matching type', () => {
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.equal(true);
      expect(isOptionalKeyWithType({ num: 42 }, 'num', 'number')).to.equal(true);
    });

    it('should return false when key is present with wrong type', () => {
      expect(isOptionalKeyWithType({ foo: 123 }, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'number')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isOptionalKeyWithType(null, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType(undefined, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType('string', 'foo', 'string')).to.equal(false);
    });
  });

  describe('isOptionalKeyWithType() with array of types', () => {
    it('should return true when key is absent', () => {
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return true when key exists with value matching any allowed type', () => {
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'number'])).to.equal(true);
      expect(isOptionalKeyWithType({ x: 42 }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return true when key exists and is undefined', () => {
      expect(isOptionalKeyWithType({ x: undefined }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return false when key exists with value matching none of the allowed types', () => {
      expect(isOptionalKeyWithType({ x: true }, 'x', ['string', 'number'])).to.equal(false);
      expect(isOptionalKeyWithType({ x: Symbol('sym') }, 'x', ['string', 'boolean'])).to.equal(false);
    });

    it('should return false when object is not an object', () => {
      expect(isOptionalKeyWithType(undefined, 'x', ['string', 'number'])).to.equal(false);
      expect(isOptionalKeyWithType('not an object', 'x', ['string', 'number'])).to.equal(false);
    });

    it('should work with single-element array', () => {
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string'])).to.equal(true);
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string'])).to.equal(true);
      expect(isOptionalKeyWithType({ x: 42 }, 'x', ['string'])).to.equal(false);
    });

    it('should work with null as an allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isOptionalKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);
      // eslint-disable-next-line unicorn/no-null
      expect(isOptionalKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'null'])).to.equal(true);
    });
  });

  describe('isPropertyKey()', () => {
    it('should return true for strings', () => {
      expect(isPropertyKey('foo')).to.equal(true);
      expect(isPropertyKey('')).to.equal(true);
    });

    it('should return true for numbers', () => {
      expect(isPropertyKey(0)).to.equal(true);
      expect(isPropertyKey(42)).to.equal(true);
    });

    it('should return true for symbols', () => {
      expect(isPropertyKey(Symbol('test'))).to.equal(true);
    });

    it('should return false for non-PropertyKey values', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isPropertyKey(null)).to.equal(false);
      expect(isPropertyKey(undefined)).to.equal(false);
      expect(isPropertyKey({})).to.equal(false);
      expect(isPropertyKey([])).to.equal(false);
      expect(isPropertyKey(true)).to.equal(false);
    });
  });
});
