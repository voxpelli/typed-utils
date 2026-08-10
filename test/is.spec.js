import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isArrayOfLiteralType, isKeyWithType, isKeyWithValue, isObjectValueType, isOptionalKeyWithType,
} from '../lib/is.js';

describe('is', () => {
  describe('isKeyWithValue()', () => {
    it('should return true when key exists with matching value', () => {
      assert.strictEqual(isKeyWithValue({ foo: 'bar' }, 'foo', 'bar'), true);
      assert.strictEqual(isKeyWithValue({ num: 123 }, 'num', 123), true);
    });

    it('should return false when key does not exist', () => {
      assert.strictEqual(isKeyWithValue({ foo: 'bar' }, 'baz', 'bar'), false);
    });

    it('should return false when key exists but has wrong value', () => {
      assert.strictEqual(isKeyWithValue({ foo: 'bar' }, 'foo', 'baz'), false);
    });
  });

  describe('isKeyWithType() with array of types', () => {
    it('should return true when value matches any allowed type', () => {
      assert.strictEqual(isKeyWithType({ x: 'hello' }, 'x', ['string', 'number']), true);
      assert.strictEqual(isKeyWithType({ x: 42 }, 'x', ['string', 'number']), true);
      assert.strictEqual(isKeyWithType({ x: true }, 'x', ['boolean', 'number']), true);
    });

    it('should return false when value matches none of the allowed types', () => {
      assert.strictEqual(isKeyWithType({ x: true }, 'x', ['string', 'number']), false);
      assert.strictEqual(isKeyWithType({ x: 'hello' }, 'x', ['number', 'boolean']), false);
    });

    it('should work with single-element array', () => {
      assert.strictEqual(isKeyWithType({ x: 'hello' }, 'x', ['string']), true);
      assert.strictEqual(isKeyWithType({ x: 42 }, 'x', ['string']), false);
    });

    it('should return false for key not in object', () => {
      assert.strictEqual(isKeyWithType({ x: 'hello' }, 'y', ['string', 'number']), false);
    });

    it('should return false when object is not an object', () => {
      assert.strictEqual(isKeyWithType(undefined, 'x', ['string', 'number']), false);
      assert.strictEqual(isKeyWithType('not an object', 'x', ['string', 'number']), false);
    });

    it('should work with null as an allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isKeyWithType({ x: null }, 'x', ['string', 'null']), true);
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isKeyWithType({ x: null }, 'x', ['number', 'boolean']), false);
      assert.strictEqual(isKeyWithType({ x: 'hello' }, 'x', ['string', 'null']), true);
    });
  });

  describe('isOptionalKeyWithType() with array of types', () => {
    it('should return true when key is absent', () => {
      assert.strictEqual(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'number']), true);
    });

    it('should return true when key exists with value matching any allowed type', () => {
      assert.strictEqual(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'number']), true);
      assert.strictEqual(isOptionalKeyWithType({ x: 42 }, 'x', ['string', 'number']), true);
    });

    it('should return true when key exists and is undefined', () => {
      assert.strictEqual(isOptionalKeyWithType({ x: undefined }, 'x', ['string', 'number']), true);
    });

    it('should return false when key exists with value matching none of the allowed types', () => {
      assert.strictEqual(isOptionalKeyWithType({ x: true }, 'x', ['string', 'number']), false);
      assert.strictEqual(isOptionalKeyWithType({ x: Symbol('sym') }, 'x', ['string', 'boolean']), false);
    });

    it('should return false when object is not an object', () => {
      assert.strictEqual(isOptionalKeyWithType(undefined, 'x', ['string', 'number']), false);
      assert.strictEqual(isOptionalKeyWithType('not an object', 'x', ['string', 'number']), false);
    });

    it('should work with single-element array', () => {
      assert.strictEqual(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string']), true);
      assert.strictEqual(isOptionalKeyWithType({ y: 'other' }, 'x', ['string']), true);
      assert.strictEqual(isOptionalKeyWithType({ x: 42 }, 'x', ['string']), false);
    });

    it('should work with null as an allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isOptionalKeyWithType({ x: null }, 'x', ['string', 'null']), true);
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isOptionalKeyWithType({ x: null }, 'x', ['number', 'boolean']), false);
      assert.strictEqual(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'null']), true);
      assert.strictEqual(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'null']), true);
    });
  });

  describe('isArrayOfLiteralType()', () => {
    it('should return true for arrays with all elements of correct type', () => {
      assert.strictEqual(isArrayOfLiteralType(['foo', 'bar', 'baz'], 'string'), true);
      assert.strictEqual(isArrayOfLiteralType([1, 2, 3], 'number'), true);
      assert.strictEqual(isArrayOfLiteralType([true, false], 'boolean'), true);
      assert.strictEqual(isArrayOfLiteralType([[], [1], [2, 3]], 'array'), true);
    });

    it('should return true for empty arrays', () => {
      assert.strictEqual(isArrayOfLiteralType([], 'string'), true);
      assert.strictEqual(isArrayOfLiteralType([], 'number'), true);
    });

    it('should return false when array contains element of wrong type', () => {
      assert.strictEqual(isArrayOfLiteralType(['foo', 123, 'bar'], 'string'), false);
      assert.strictEqual(isArrayOfLiteralType([1, 2, 'three'], 'number'), false);
    });

    it('should return false for non-array values', () => {
      assert.strictEqual(isArrayOfLiteralType('not an array', 'string'), false);
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isArrayOfLiteralType(null, 'string'), false);
      assert.strictEqual(isArrayOfLiteralType(undefined, 'string'), false);
    });
  });

  describe('isArrayOfLiteralType() with array of types', () => {
    it('should return true for arrays with elements matching any allowed type', () => {
      assert.strictEqual(isArrayOfLiteralType(['foo', 123, 'bar'], ['string', 'number']), true);
      assert.strictEqual(isArrayOfLiteralType([1, 'two', 3], ['string', 'number']), true);
      assert.strictEqual(isArrayOfLiteralType([true, 42, 'test'], ['boolean', 'number', 'string']), true);
    });

    it('should return false when array contains element not matching any allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isArrayOfLiteralType(['foo', null], ['string', 'number']), false);
      assert.strictEqual(isArrayOfLiteralType([1, undefined], ['string', 'boolean']), false);
    });
  });

  describe('isObjectValueType()', () => {
    it('should return true for objects with all values of correct type', () => {
      assert.strictEqual(isObjectValueType({ a: 'foo', b: 'bar' }, 'string'), true);
      assert.strictEqual(isObjectValueType({ x: 1, y: 2, z: 3 }, 'number'), true);
      assert.strictEqual(isObjectValueType({ flag1: true, flag2: false }, 'boolean'), true);
    });

    it('should return true for empty objects', () => {
      assert.strictEqual(isObjectValueType({}, 'string'), true);
      assert.strictEqual(isObjectValueType({}, 'number'), true);
    });

    it('should return false when object contains value of wrong type', () => {
      assert.strictEqual(isObjectValueType({ a: 'foo', b: 123 }, 'string'), false);
      assert.strictEqual(isObjectValueType({ x: 1, y: 'two' }, 'number'), false);
    });

    it('should return false when value is not an object', () => {
      assert.strictEqual(isObjectValueType('string', 'string'), false);
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isObjectValueType(null, 'string'), false);
      assert.strictEqual(isObjectValueType(123, 'string'), false);
    });
  });

  describe('isObjectValueType() with array of types', () => {
    it('should return true for objects with values of any allowed type', () => {
      assert.strictEqual(isObjectValueType({ a: 'foo', b: 123, c: true }, ['string', 'number', 'boolean']), true);
      assert.strictEqual(isObjectValueType({ x: 1, y: 'two' }, ['string', 'number']), true);
      assert.strictEqual(isObjectValueType({ flag: true, count: 42 }, ['boolean', 'number']), true);
    });

    it('should return false when object contains value not matching any allowed type', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isObjectValueType({ a: 'foo', b: null }, ['string', 'number']), false);
      assert.strictEqual(isObjectValueType({ x: 1, y: undefined }, ['string', 'boolean']), false);
    });
  });
});
